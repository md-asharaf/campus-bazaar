import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { feedbackService } from '@/services/feedback.service';
import { createQueryFn, createMutationFn, handleApiError } from '@/utils/apiHelpers';
import { queryKeys, getQueryKeysToInvalidate } from './queryKeys';
import type { Feedback } from '@/types';

// Types
type CreateFeedbackData = {
  content: string;
  rating: number;
};

type UpdateFeedbackData = {
  content?: string;
  rating?: number;
};

// Get My Feedback Hook
export const useMyFeedback = () => {
  return useQuery({
    queryKey: queryKeys.feedback.my(),
    queryFn: createQueryFn<Feedback | null>(feedbackService.getMyFeedback.bind(feedbackService)),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Create Feedback Hook
export const useCreateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<Feedback, CreateFeedbackData>(feedbackService.createFeedback.bind(feedbackService)),
    onSuccess: (data) => {
      // Update the feedback cache
      queryClient.setQueryData(queryKeys.feedback.my(), data);
      
      // Invalidate related queries
      getQueryKeysToInvalidate.onFeedbackChange().forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      toast.success('Thank you for your feedback!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to submit feedback: ${message}`);
    },
  });
};

// Update Feedback Hook
export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<Feedback, UpdateFeedbackData>(feedbackService.updateMyFeedback.bind(feedbackService)),
    onSuccess: (data) => {
      // Update the feedback cache
      queryClient.setQueryData(queryKeys.feedback.my(), data);
      
      // Invalidate related queries
      getQueryKeysToInvalidate.onFeedbackChange().forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      toast.success('Feedback updated successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to update feedback: ${message}`);
    },
  });
};

// Delete Feedback Hook
export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<{ message: string }, void>(feedbackService.deleteMyFeedback.bind(feedbackService)),
    onSuccess: () => {
      // Remove feedback from cache
      queryClient.setQueryData(queryKeys.feedback.my(), null);
      
      // Invalidate related queries
      getQueryKeysToInvalidate.onFeedbackChange().forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      toast.success('Feedback deleted successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to delete feedback: ${message}`);
    },
  });
};

// Hook to check if user has submitted feedback
export const useFeedbackStatus = () => {
  const { data: feedback, isLoading, error } = useMyFeedback();
  
  return {
    feedback,
    hasFeedback: !!feedback,
    isLoading,
    error,
    rating: feedback?.rating,
    content: feedback?.content,
    createdAt: feedback?.createdAt,
    updatedAt: feedback?.updatedAt,
  };
};

// Hook for optimistic feedback updates
export const useOptimisticFeedback = () => {
  const queryClient = useQueryClient();
  
  const updateFeedbackOptimistically = (updates: Partial<Feedback>) => {
    queryClient.setQueryData(
      queryKeys.feedback.my(), 
      (oldData: Feedback | null | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...updates };
      }
    );
  };

  const rollbackFeedbackUpdate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.feedback.my() });
  };

  return { updateFeedbackOptimistically, rollbackFeedbackUpdate };
};

// Hook to prefetch feedback data
export const usePrefetchFeedback = () => {
  const queryClient = useQueryClient();
  
  const prefetchFeedback = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.feedback.my(),
      queryFn: createQueryFn<Feedback | null>(feedbackService.getMyFeedback.bind(feedbackService)),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchFeedback };
};

// Hook to create or update feedback (smart mutation)
export const useSubmitFeedback = () => {
  const { data: existingFeedback } = useMyFeedback();
  const createFeedback = useCreateFeedback();
  const updateFeedback = useUpdateFeedback();

  return useMutation({
    mutationFn: (data: CreateFeedbackData) => {
      if (existingFeedback) {
        return updateFeedback.mutateAsync(data);
      } else {
        return createFeedback.mutateAsync(data);
      }
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to submit feedback: ${message}`);
    },
  });
};

// Hook for feedback form validation
export const useFeedbackValidation = () => {
  const validateFeedback = (content: string, rating: number) => {
    const errors: string[] = [];

    if (!content || content.trim().length === 0) {
      errors.push('Feedback content is required');
    }

    if (content && content.length > 1000) {
      errors.push('Feedback content must be less than 1000 characters');
    }

    if (rating < 1 || rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }

    if (!Number.isInteger(rating)) {
      errors.push('Rating must be a whole number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  return { validateFeedback };
};
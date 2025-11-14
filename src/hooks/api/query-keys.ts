
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    refresh: () => [...queryKeys.auth.all, 'refresh'] as const,
    google: (code?: string) => [...queryKeys.auth.all, 'google', code] as const,
  },

  // Profile/User
  profile: {
    all: ['profile'] as const,
    me: () => [...queryKeys.profile.all, 'me'] as const,
    verify: () => [...queryKeys.profile.all, 'verify'] as const,
  },

  // Items
  items: {
    all: ['items'] as const,
    lists: () => [...queryKeys.items.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.items.lists(), { filters }] as const,
    details: () => [...queryKeys.items.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.items.details(), id] as const,
    my: () => [...queryKeys.items.all, 'my'] as const,
    search: (query?: string, filters?: Record<string, any>) => 
      [...queryKeys.items.all, 'search', { query, filters }] as const,
  },

  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.categories.lists(), { filters }] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
    options: () => [...queryKeys.categories.all, 'options'] as const,
  },

  // Chat
  chat: {
    all: ['chat'] as const,
    conversations: () => [...queryKeys.chat.all, 'conversations'] as const,
    messages: (chatId: string) => [...queryKeys.chat.all, 'messages', chatId] as const,
    myChats: () => [...queryKeys.chat.all, 'my-chats'] as const,
  },

  // Wishlist
  wishlist: {
    all: ['wishlist'] as const,
    my: () => [...queryKeys.wishlist.all, 'my'] as const,
    item: (itemId: string) => [...queryKeys.wishlist.all, 'item', itemId] as const,
  },

  // Feedback
  feedback: {
    all: ['feedback'] as const,
    lists: () => [...queryKeys.feedback.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.feedback.lists(), { filters }] as const,
    details: () => [...queryKeys.feedback.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.feedback.details(), id] as const,
    my: () => [...queryKeys.feedback.all, 'my'] as const,
  },

  // Search
  search: {
    all: ['search'] as const,
    items: (query: string, filters?: Record<string, any>) => 
      [...queryKeys.search.all, 'items', { query, filters }] as const,
    suggestions: (query: string) => [...queryKeys.search.all, 'suggestions', query] as const,
    filters: () => [...queryKeys.search.all, 'filters'] as const,
  },

  // Admin
  admin: {
    all: ['admin'] as const,
    users: {
      all: () => [...queryKeys.admin.all, 'users'] as const,
      lists: () => [...queryKeys.admin.users.all(), 'list'] as const,
      list: (filters?: Record<string, any>) => [...queryKeys.admin.users.lists(), { filters }] as const,
      details: () => [...queryKeys.admin.users.all(), 'detail'] as const,
      detail: (id: string) => [...queryKeys.admin.users.details(), id] as const,
    },
    items: {
      all: () => [...queryKeys.admin.all, 'items'] as const,
      lists: () => [...queryKeys.admin.items.all(), 'list'] as const,
      list: (filters?: Record<string, any>) => [...queryKeys.admin.items.lists(), { filters }] as const,
      details: () => [...queryKeys.admin.items.all(), 'detail'] as const,
      detail: (id: string) => [...queryKeys.admin.items.details(), id] as const,
    },
    categories: {
      all: () => [...queryKeys.admin.all, 'categories'] as const,
      lists: () => [...queryKeys.admin.categories.all(), 'list'] as const,
      list: (filters?: Record<string, any>) => [...queryKeys.admin.categories.lists(), { filters }] as const,
      details: () => [...queryKeys.admin.categories.all(), 'detail'] as const,
      detail: (id: string) => [...queryKeys.admin.categories.details(), id] as const,
    },
    verification: {
      all: () => [...queryKeys.admin.all, 'verification'] as const,
      lists: () => [...queryKeys.admin.verification.all(), 'list'] as const,
      list: (filters?: Record<string, any>) => [...queryKeys.admin.verification.lists(), { filters }] as const,
      details: () => [...queryKeys.admin.verification.all(), 'detail'] as const,
      detail: (id: string) => [...queryKeys.admin.verification.details(), id] as const,
    },
    feedback: {
      all: () => [...queryKeys.admin.all, 'feedback'] as const,
      lists: () => [...queryKeys.admin.feedback.all(), 'list'] as const,
      list: (filters?: Record<string, any>) => [...queryKeys.admin.feedback.lists(), { filters }] as const,
      details: () => [...queryKeys.admin.feedback.all(), 'detail'] as const,
      detail: (id: string) => [...queryKeys.admin.feedback.details(), id] as const,
    },
    dashboard: {
      all: () => [...queryKeys.admin.all, 'dashboard'] as const,
      stats: () => [...queryKeys.admin.dashboard.all(), 'stats'] as const,
    },
  },

  // Health
  health: {
    all: ['health'] as const,
    status: () => [...queryKeys.health.all, 'status'] as const,
    api: () => [...queryKeys.health.all, 'api'] as const,
    connectivity: () => [...queryKeys.health.all, 'connectivity'] as const,
  },
} as const;

// Helper functions for invalidating related queries
export const getQueryKeysToInvalidate = {
  // When user profile changes
  onProfileUpdate: () => [
    queryKeys.profile.all,
    queryKeys.items.my(),
    queryKeys.wishlist.my(),
    queryKeys.feedback.my(),
    queryKeys.chat.myChats(),
  ],

  // When an item is created/updated/deleted
  onItemChange: (itemId?: string) => [
    queryKeys.items.all,
    queryKeys.search.all,
    ...(itemId ? [queryKeys.items.detail(itemId)] : []),
  ],

  // When wishlist changes
  onWishlistChange: (itemId?: string) => [
    queryKeys.wishlist.all,
    ...(itemId ? [queryKeys.wishlist.item(itemId)] : []),
  ],

  // When categories change
  onCategoryChange: () => [
    queryKeys.categories.all,
    queryKeys.items.all, // Items may reference categories
    queryKeys.search.filters(),
  ],

  // When feedback changes
  onFeedbackChange: () => [
    queryKeys.feedback.all,
  ],

  // When chat/messages change
  onChatChange: (chatId?: string) => [
    queryKeys.chat.myChats(),
    queryKeys.chat.conversations(),
    ...(chatId ? [queryKeys.chat.messages(chatId)] : []),
  ],

  // Admin actions that affect multiple resources
  onAdminUserAction: () => [
    queryKeys.admin.users.all(),
    queryKeys.admin.dashboard.stats(),
  ],

  onAdminItemAction: () => [
    queryKeys.admin.items.all(),
    queryKeys.items.all,
    queryKeys.admin.dashboard.stats(),
  ],

  onAdminCategoryAction: () => [
    queryKeys.admin.categories.all(),
    queryKeys.categories.all,
  ],

  onAdminVerificationAction: () => [
    queryKeys.admin.verification.all(),
    queryKeys.admin.dashboard.stats(),
  ],
};
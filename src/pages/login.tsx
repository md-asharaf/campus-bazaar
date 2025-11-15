import { useMemo } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

/**
 * Router shim that redirects to the correct dedicated login page.
 * - Admins: /admin-login (triggered by ?type=admin or ?from starting with /admin)
 * - Students: /student-login (default)
 *
 * All existing query parameters are preserved during the redirect.
 */
export function Login() {
  const [searchParams] = useSearchParams();

  const target = useMemo(() => {
    const from = searchParams.get("from") || "";
    const type = searchParams.get("type");

    const isAdmin = type === "admin" || from.startsWith("/admin");
    return isAdmin ? "/admin-login" : "/student-login";
  }, [searchParams]);

  const queryString = searchParams.toString();
  const to = queryString ? `${target}?${queryString}` : target;

  return <Navigate to={to} replace />;
}

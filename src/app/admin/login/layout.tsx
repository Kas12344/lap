import React from 'react';

// App Router segment layouts should use a named export (e.g., `Layout`)
// and must not include <html> or <body> tags.
export function Layout({ children }: { children: React}): React.JSX.Element {
  return <>{children}</>;
}
export default Layout;
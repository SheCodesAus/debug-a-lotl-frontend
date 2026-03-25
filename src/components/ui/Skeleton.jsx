/**
 * Shimmer placeholders — paired with `.skeleton-shimmer` in index.css (respects reduced motion).
 */
export function SkeletonBlock({ className = "", ...rest }) {
  return (
    <div
      className={`skeleton-shimmer rounded-lg ${className}`.trim()}
      {...rest}
    />
  );
}

export function SkeletonLine({ className = "", ...rest }) {
  return <SkeletonBlock className={`h-3 rounded-md ${className}`.trim()} {...rest} />;
}

export function SkeletonCircle({ className = "", size = 64, ...rest }) {
  return (
    <SkeletonBlock
      className={`rounded-full shrink-0 ${className}`.trim()}
      style={{ width: size, height: size }}
      {...rest}
    />
  );
}

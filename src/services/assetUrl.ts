export function resolveAssetUrl(url?: string): string {
  if (!url) return '';

  const trimmed = url.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `${window.location.protocol}${trimmed}`;
  }

  if (trimmed.startsWith('/')) {
    return `${window.location.origin}${trimmed}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
        return `${window.location.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
      return trimmed;
    } catch {
      return trimmed;
    }
  }

  return `${window.location.origin}/${trimmed.replace(/^\/+/, '')}`;
}

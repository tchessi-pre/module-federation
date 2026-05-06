declare module 'feedback/Routes' {
  const Routes: () => JSX.Element
  export default Routes
}

declare module 'analytics/Routes' {
  const Routes: () => JSX.Element
  export default Routes
}

declare module 'assistant/Routes' {
  const Routes: () => JSX.Element
  export default Routes
}

declare module 'assistant/mount' {
  export function mount(
    element: Element,
    options?: { basename?: string },
  ): void | (() => void)

  export function unmount(): void
}

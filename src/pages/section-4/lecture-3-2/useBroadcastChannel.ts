import { useCallback, useEffect, useRef } from 'react';

function useBroadcastChannel(channelName: string) {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (channelRef.current) {
      return;
    }

    channelRef.current = new BroadcastChannel(channelName);
    return () => {
      channelRef.current?.close();
      channelRef.current = null;
    };
  }, [channelName]);

  const sendMessage = useCallback((msg: string) => {
    channelRef.current?.postMessage(msg);
  }, []);

  const subscribe = useCallback(
    (callback: (msg: string) => void) => {
      if (!channelRef.current) return () => {};
      const handler = (event: MessageEvent) => {
        callback(event.data);
      };
      channelRef.current.addEventListener(
        'message',
        handler,
      );

      return () => {
        channelRef.current?.removeEventListener(
          'message',
          handler,
        );
      };
    },
    [],
  );

  return { sendMessage, subscribe };
}

export default useBroadcastChannel;

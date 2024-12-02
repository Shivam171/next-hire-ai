import { useState, useEffect } from 'react';

function useLoadingMessages(
    messages: string[],
    isActive: boolean,
    intervalTime: number = 1500
): string {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        if (isActive) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex < messages.length - 1 ? prevIndex + 1 : 0
                );
            }, intervalTime);

            return () => clearInterval(interval);
        } else {
            setCurrentIndex(0);
        }
    }, [isActive, messages, intervalTime]);

    return messages[currentIndex];
}

export default useLoadingMessages;

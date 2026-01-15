import { useEffect, useState } from 'react';

const useRandomEmoji = () => {
  const emojis = ['🙌', '🍾', '🥂', '🎉', '🎊', '🥳', '✨', '🎂', '🤩'];
  const [currentEmoji, setCurrentEmoji] = useState(null);

  useEffect(() => {
    const newEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setCurrentEmoji(newEmoji);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return currentEmoji;
};

export { useRandomEmoji };

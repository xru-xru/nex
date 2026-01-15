import { NexoyaOptimizedContent, NexoyaOptimizedContentStatusType } from 'types';

function extractSkippedContent(optimizedContent: NexoyaOptimizedContent[]) {
  // to keep skipped content separated form sorting, on the bottom
  const skippedContent = [];
  const optimizationContent = [];
  function isContentSkipped(content: NexoyaOptimizedContent) {
    return content?.status?.type === NexoyaOptimizedContentStatusType.Skipped;
  }

  optimizedContent?.forEach((optContent) => {
    if (isContentSkipped(optContent)) {
      skippedContent.push({ ...optContent });
    }
    if (!isContentSkipped(optContent)) {
      optimizationContent.push({ ...optContent });
    }
  });

  return {
    optimizationContent,
    skippedContent,
  };
}

export default extractSkippedContent;

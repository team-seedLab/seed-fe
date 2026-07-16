import { MarkdownContent } from "@/shared";

type Props = {
  content: string;
};

export const UploadAiMentorMarkdown = ({ content }: Props) => {
  return <MarkdownContent content={content} />;
};

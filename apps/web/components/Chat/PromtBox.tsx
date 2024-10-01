import React, { FC } from "react";
import { TextGenerateEffect } from "@repo/ui/components/ui/text-generate-effect";
import { User } from "lucide-react";

const words = `Oxygen gets you high. In a catastrophic emergency, we're taking giant, panicked breaths. Suddenly you become euphoric, docile. You accept your fate. It's all right here. Emergency water landing, six hundred miles an hour. Blank faces, calm as Hindu cows
`;

interface Props {
  prompt: string;
}
const PromptBox: FC<Props> = ({ prompt }) => {
  return (
    <div className="flex flex-col items-end w-full">
      <div className="max-w-[80%] flex flex-col">
        <User className="w-5 h-5 text-white " />
        <div className="bg-[#38bdf8] bg-gradient-to-br from-sky-600 to-blue-800 px-4 pb-4 rounded-[4px]">
          <TextGenerateEffect words={prompt} duration={0.5} className="" />
        </div>
      </div>
    </div>
  );
};

export default PromptBox;

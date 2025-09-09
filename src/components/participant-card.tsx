import React from "react";

interface ParticipantCardProps {
  position: string;
  name: string;
  instagram: string;
}

const ParticipantCard = ({
  position,
  name,
  instagram,
}: ParticipantCardProps) => {
  return (
    <div className="flex flex-col items-center justify-between">
      <p className="text-[10px] font-normal text-[#000000]">{position}</p>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-normal text-[#000000]">{name}</p>
        <p className="text-[10px] font-normal text-[#000000]">{instagram}</p>
      </div>
    </div>
  );
};

export default ParticipantCard;

import React from "react";
import Link from "next/link";
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
      <div className="flex items-center justify-between gap-1">
        <p className="text-[10px] font-normal text-[#000000]">{name}</p>
        <Link href={`https://instagram.com/${instagram}`} target="_blank">
          <p className="text-[10px] font-normal text-[#000000] hover:underline">
            @{instagram}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ParticipantCard;

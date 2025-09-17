import Modal from "@/components/modal";
import ParticipantCard from "@/components/participant-card";
import ModalPageLayout from "@/components/modal-page-layout";
import { getCafes, getParticipants } from "@/lib/actions";

// 배포환경 모달 라우팅 문제 해결을 위한 dynamic export
export const dynamic = "force-dynamic";

export default async function ContactModal() {
  const cafes = await getCafes();
  const serverParticipants = await getParticipants();
  const participants = [
    {
      position: "베이커",
      name: "김지은",
      instagram: "prissy__1995",
    },
    {
      position: "바리스타",
      name: "최광현",
      instagram: "rhkdgus",
    },

    {
      position: "바리스타",
      name: "하청비",
      instagram: "___wanna.bi_",
    },

    {
      position: "디자이너",
      name: "신동욱",
      instagram: "uxshin",
    },
    {
      position: "음악.",
      name: "박근하",
      instagram: "geunhapark",
    },
  ];
  return (
    <Modal>
      <ModalPageLayout subTitle="CREDIT">
        <div>
          <div className="flex flex-col gap-2">
            {participants.map((participant) => (
              <ParticipantCard key={participant.name} {...participant} />
            ))}
          </div>
          {/* // 2열 그리드 영역  */}
          <div className="grid grid-cols-2 gap-2 mt-6">
            {cafes.map((cafe) => (
              <div key={cafe.id} className="flex flex-col items-center p-4">
                <p className="text-[10px] font-normal text-[#000000] mb-2">
                  {cafe.name}
                </p>
                <div className="flex flex-col gap-2">
                  {/* // 참가자가 없을때, 예외처리  */}
                  {serverParticipants.filter(
                    (participant) => participant.cafeId === cafe.id
                  ).length === 0 ? (
                    <p className="text-[10px] font-normal text-[#000000]">
                      등록된 참가자가 없습니다.
                    </p>
                  ) : (
                    serverParticipants
                      .filter((participant) => participant.cafeId === cafe.id)
                      .map((participant) => (
                        <ParticipantCard
                          key={participant.name}
                          position={participant.position || ""}
                          name={participant.name}
                          instagram={participant.instagram || ""}
                        />
                      ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModalPageLayout>
    </Modal>
  );
}

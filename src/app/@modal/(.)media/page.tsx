import Modal from "@/components/modal";
import ModalPageLayout from "@/components/modal-page-layout";

export default function MediaModal() {
  const media = [
    {
      title: "캠페인 영상",
      link: "https://www.google.com",
    },
    {
      title: "배너 영상",
      link: "https://www.google.com",
    },
    {
      title: "인스타그램",
      link: "https://www.google.com",
    },
  ];
  return (
    <Modal>
      <ModalPageLayout subTitle="MEDIA">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          {media.map((media) => (
            <div key={media.title}>
              <a
                href={media.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-normal text-[#000000]"
              >
                {media.title}
              </a>
            </div>
          ))}
        </div>
      </ModalPageLayout>
    </Modal>
  );
}

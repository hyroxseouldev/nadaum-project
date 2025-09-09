import ModalPageHeader from "@/components/modal-page-header";
import ModalPageFooter from "@/components/modal-page-footer";

interface ModalPageLayoutProps {
  subTitle: string;
  children: React.ReactNode;
}

const ModalPageLayout = ({ children, subTitle }: ModalPageLayoutProps) => {
  return (
    <div className="pt-12">
      {/* Header */}
      <div className="mb-8">
        <ModalPageHeader subTitle={subTitle} />
      </div>
      {/* Participant List */}
      <div>{children}</div>

      <div className="p-5">
        <ModalPageFooter />
      </div>
    </div>
  );
};

export default ModalPageLayout;

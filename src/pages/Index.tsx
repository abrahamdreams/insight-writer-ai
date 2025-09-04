import Header from '@/components/Header';
import DocumentEditor from '@/components/DocumentEditor';
import ExpertReview from '@/components/ExpertReview';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1">
        <DocumentEditor />
        <ExpertReview />
      </div>
    </div>
  );
};

export default Index;

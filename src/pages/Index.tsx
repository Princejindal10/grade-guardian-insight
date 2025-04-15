
import SignupForm from "@/components/SignupForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-edu-light flex flex-col">
      <div className="container mx-auto px-4 py-16 flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-edu-dark">
            Grade <span className="text-edu-primary">Guardian</span> Insight
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Predict your grades, plan your performance, and achieve your academic goals with confidence.
          </p>
        </div>
        
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
      
      <div className="bg-edu-dark py-6 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Grade Guardian Insight | Helping students achieve academic excellence</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

import { useState } from "react";
import { Award, Trophy, GraduationCap, Medal } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
// Import the CSS for hiding scrollbars
import "@/styles/scrollbar-hide.css";

// Separate component for the content to be reused
export function HonorsAwardsContent() {
  // Add a scroll event handler to prevent propagation
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="h-full overflow-y-auto pt-12 pb-16 px-6 scrollbar-hide"
      onScroll={handleScroll}
    >
      <SheetHeader className="pb-4 border-b mb-6">
        <SheetTitle className="text-3xl font-bold tracking-tighter flex items-center">
          <Award className="h-6 w-6 mr-3 text-primary" />
          Honors & Awards
        </SheetTitle>
      </SheetHeader>

      {/* Add significant padding to create space below the header */}
      <div className="pt-20">
        {/* Academic Honors */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-primary" />
            Academic Achievements
          </h2>
          <ul className="space-y-3 pl-2">
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">Dean's List (8 Semesters)</span>
              <span className="text-sm text-muted-foreground">Hofstra University, 2019-2024</span>
            </li>
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">Master of Science in Computer Science with Distinction</span>
              <span className="text-sm text-muted-foreground">August 2024</span>
            </li>
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">CAA Commissioners Academic Honor Roll</span>
              <span className="text-sm text-muted-foreground">2020-2023 (5 times)</span>
            </li>
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">Hofstra Athletic Directors Scholars Academic Honor Roll</span>
              <span className="text-sm text-muted-foreground">2021-2023 (3 times)</span>
            </li>
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">ITA Scholar-Athlete</span>
              <span className="text-sm text-muted-foreground">Intercollegiate Tennis Association, 2021 & 2023</span>
            </li>
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">SAT Score: 1440</span>
              <span className="text-sm text-muted-foreground">97th percentile nationally, 2018</span>
            </li>
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">AP Scholar</span>
              <span className="text-sm text-muted-foreground">CollegeBoard, 2018</span>
              <span className="text-sm text-muted-foreground">Score 5/5 on three AP exams</span>
            </li>
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">High School Honors</span>
              <span className="text-sm text-muted-foreground">Rafa Nadal Academy, 2018</span>
            </li>
          </ul>
        </section>

        {/* Athletic Honors */}
        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-primary" />
            Athletic Honors
          </h2>
          <ul className="space-y-3 pl-2">
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">Team Captain, Division 1 Men's Tennis Team</span>
              <span className="text-sm text-muted-foreground">Hofstra University, 2022-2024 (2 seasons)</span>
            </li>
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">Nick Colleluori Unsung Hero Award Nominee</span>
              <span className="text-sm text-muted-foreground">Hofstra University, May 2024</span>
              <span className="text-sm text-muted-foreground">Recognizes student-athletes who help their teams achieve success in ways not measured by statistics</span>
            </li>
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">Team Pride Award</span>
              <span className="text-sm text-muted-foreground">Hofstra University, May 2023 & May 2024</span>
              <span className="text-sm text-muted-foreground">Honors student-athletes who are selfless and always put their team first</span>
            </li>
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">Strength and Conditioning Athlete of the Year</span>
              <span className="text-sm text-muted-foreground">Hofstra University, May 2023</span>
              <span className="text-sm text-muted-foreground">For outstanding performance and commitment to strength and conditioning</span>
            </li>
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">Strength and Conditioning Athlete of the Year Nominee</span>
              <span className="text-sm text-muted-foreground">Hofstra University, May 2022</span>
              <span className="text-sm text-muted-foreground">One of four finalists for the award</span>
            </li>
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">ITA Northeast Super Regionals Qualifier</span>
              <span className="text-sm text-muted-foreground">Intercollegiate Tennis Association, October 2023</span>
              <span className="text-sm text-muted-foreground">First qualifier in Hofstra tennis history to the Super Regionals held at Princeton</span>
            </li>
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">ITA Northeast Regionals Qualifier</span>
              <span className="text-sm text-muted-foreground">Intercollegiate Tennis Association, October 2022 & 2023</span>
              <span className="text-sm text-muted-foreground">Tournament featuring top men's players across the Northeast region</span>
            </li>
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">Academic All-Conference Team</span>
              <span className="text-sm text-muted-foreground">Colonial Athletic Association, 2022-2023</span>
            </li>
          </ul>
        </section>

        {/* Professional Recognition */}
        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <Medal className="h-5 w-5 mr-2 text-primary" />
            Professional Recognition & Leadership
          </h2>
          <ul className="space-y-3 pl-2">
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">Digital Remedy Venture Challenge Finalist</span>
              <span className="text-sm text-muted-foreground">Hofstra University, May 2022 & May 2023</span>
              <span className="text-sm text-muted-foreground">Presented BoJo entrepreneurial venture twice as finalist</span>
            </li>
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">Colonel E. David Wojcik, Jr Leadership Academy</span>
              <span className="text-sm text-muted-foreground">Hofstra University Athletics, September 2022</span>
              <span className="text-sm text-muted-foreground">Selected for student-athlete leadership and mentorship program</span>
            </li>
          </ul>
        </section>

        {/* Memberships & Affiliations */}
        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <Award className="h-5 w-5 mr-2 text-primary" />
            Memberships & Affiliations
          </h2>
          <ul className="space-y-3 pl-2">
            <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
              <span className="font-medium">Theta Tau Professional Engineering Fraternity</span>
              <span className="text-sm text-muted-foreground">Member, 2021-2024</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

// Main component with the standalone sidebar button and sheet
export function HonorsAwardsSheet() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="fixed left-0 top-1/2 transform -translate-y-1/2 -rotate-90 origin-left bg-background border-2 border-primary hover:bg-muted/50 z-40 py-2 px-6 rounded-t-lg shadow-md font-medium"
        >
          <Trophy className="h-4 w-4 mr-2 inline-block rotate-90" />
          Honors & Awards
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-full max-w-md p-0 overflow-hidden border-r-2 border-primary"
      >
        <HonorsAwardsContent />
      </SheetContent>
    </Sheet>
  );
}

// Export the components
HonorsAwardsSheet.Content = HonorsAwardsContent; 
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Award, Trophy, GraduationCap, Medal } from "lucide-react";

interface HonorsAwardsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HonorsAwardsModal({ open, onOpenChange }: HonorsAwardsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold tracking-tighter mb-6">Honors & Awards</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Academic Honors */}
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Academic Achievements
            </h2>
            <ul className="space-y-3">
              <li className="flex flex-col">
                <span className="font-medium">Dean's List (8 Semesters)</span>
                <span className="text-sm text-muted-foreground">Hofstra University, 2020-2023</span>
                <span className="text-sm text-muted-foreground">GPA of 3.5 or higher while taking at least 12 credits</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Master of Science with Distinction</span>
                <span className="text-sm text-muted-foreground">Computer Science, GPA: 3.62</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">CAA Commissioners Academic Honor Roll</span>
                <span className="text-sm text-muted-foreground">2020-2023 (5 times)</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Hofstra Athletic Directors Scholars Academic Honor Roll</span>
                <span className="text-sm text-muted-foreground">2021-2023 (3 times)</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">ITA Scholar-Athlete</span>
                <span className="text-sm text-muted-foreground">Intercollegiate Tennis Association, 2021 & 2023</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">SAT Score: 1440</span>
                <span className="text-sm text-muted-foreground">97th percentile nationally, 2018</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">AP Scholar</span>
                <span className="text-sm text-muted-foreground">CollegeBoard, 2018</span>
                <span className="text-sm text-muted-foreground">Score of 3 or higher on three AP exams, average score of 5</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">High School Honors</span>
                <span className="text-sm text-muted-foreground">Rafa Nadal Academy, 2018</span>
              </li>
            </ul>
          </section>

          {/* Athletic Honors */}
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Athletic Honors
            </h2>
            <ul className="space-y-3">
              <li className="flex flex-col">
                <span className="font-medium">Team Captain, Division 1 Men's Tennis Team</span>
                <span className="text-sm text-muted-foreground">Hofstra University, 2022-2024 (2 seasons)</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Nick Colleluori Unsung Hero Award Nominee</span>
                <span className="text-sm text-muted-foreground">Hofstra University, May 2024</span>
                <span className="text-sm text-muted-foreground">Recognizes student-athletes who help their teams achieve success in ways not measured by statistics</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Team Pride Award</span>
                <span className="text-sm text-muted-foreground">Hofstra University, May 2023 & May 2024</span>
                <span className="text-sm text-muted-foreground">Honors student-athletes who are selfless and always put their team first</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Strength and Conditioning Athlete of the Year</span>
                <span className="text-sm text-muted-foreground">Hofstra University, May 2023</span>
                <span className="text-sm text-muted-foreground">For outstanding performance and commitment to strength and conditioning</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Strength and Conditioning Athlete of the Year Nominee</span>
                <span className="text-sm text-muted-foreground">Hofstra University, May 2022</span>
                <span className="text-sm text-muted-foreground">One of four finalists for the award</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">ITA Northeast Super Regionals Qualifier</span>
                <span className="text-sm text-muted-foreground">Intercollegiate Tennis Association, October 2023</span>
                <span className="text-sm text-muted-foreground">First qualifier in Hofstra tennis history to the Super Regionals held at Princeton</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">ITA Northeast Regionals Qualifier</span>
                <span className="text-sm text-muted-foreground">Intercollegiate Tennis Association, October 2022 & 2023</span>
                <span className="text-sm text-muted-foreground">Tournament featuring top men's players across the Northeast region</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Academic All-Conference Team</span>
                <span className="text-sm text-muted-foreground">Colonial Athletic Association, 2022-2023</span>
              </li>
            </ul>
          </section>

          {/* Professional Recognition */}
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <Medal className="h-5 w-5 mr-2" />
              Professional Recognition & Leadership
            </h2>
            <ul className="space-y-3">
              <li className="flex flex-col">
                <span className="font-medium">Digital Remedy Venture Challenge Finalist</span>
                <span className="text-sm text-muted-foreground">Hofstra University, May 2022 & May 2023</span>
                <span className="text-sm text-muted-foreground">Presented BoJo entrepreneurial venture twice as finalist</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Colonel E. David Wojcik, Jr Leadership Academy</span>
                <span className="text-sm text-muted-foreground">Hofstra University Athletics, September 2022</span>
                <span className="text-sm text-muted-foreground">Selected for student-athlete leadership and mentorship program</span>
              </li>
            </ul>
          </section>

          {/* Memberships & Affiliations */}
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Memberships & Affiliations
            </h2>
            <ul className="space-y-3">
              <li className="flex flex-col">
                <span className="font-medium">Theta Tau Professional Engineering Fraternity</span>
                <span className="text-sm text-muted-foreground">Member, 2021-2024</span>
              </li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
from typing import List
from datetime import datetime, timedelta
from app.models.models import Subject
from app.schemas.schemas import PlanItem, PlannerResponse

class AIPlannerService:
    @staticmethod
    def calculate_weight(priority: int, difficulty: int) -> int:
        return priority * difficulty

    @staticmethod
    def format_ist_time(dt: datetime) -> str:
        # Format as 12-hour AM/PM string
        return dt.strftime("%I:%M %p")

    @staticmethod
    def allocate_hours(subjects: List[Subject], daily_hours: float, start_time_str: str) -> List[PlanItem]:
        if not subjects:
            return []
        
        try:
            current_time = datetime.strptime(start_time_str, "%H:%M")
        except ValueError:
            current_time = datetime.strptime("18:00", "%H:%M") 

        weights = [AIPlannerService.calculate_weight(s.priority, s.difficulty) for s in subjects]
        total_weight = sum(weights)
        
        plan = []
        for i, s in enumerate(subjects):
            if total_weight == 0:
                allocated = daily_hours / len(subjects)
            else:
                allocated = (weights[i] / total_weight) * daily_hours
            
            allocated_minutes = int(allocated * 60)
            
            # Entire allocated time for the subject as one block
            start_str = AIPlannerService.format_ist_time(current_time)
            current_time += timedelta(minutes=allocated_minutes)
            end_str = AIPlannerService.format_ist_time(current_time)
            
            plan.append(PlanItem(
                subject=s.name, 
                allocated_hours=round(allocated, 2),
                start_time=start_str,
                end_time=end_str,
                activity_type="study"
            ))
            
            # Add a break after the subject (e.g. 15 mins) unless it's the last subject
            if i < len(subjects) - 1:
                b_start_str = AIPlannerService.format_ist_time(current_time)
                current_time += timedelta(minutes=15)
                b_end_str = AIPlannerService.format_ist_time(current_time)
                
                plan.append(PlanItem(
                    subject="Break",
                    allocated_hours=round(15/60, 2),
                    start_time=b_start_str,
                    end_time=b_end_str,
                    activity_type="break"
                ))
        
        return plan

    @staticmethod
    def generate_revision_schedule(subjects: List[Subject], daily_hours: float, start_time_str: str) -> List[PlanItem]:
        if not subjects:
            return []
        
        try:
            current_time = datetime.strptime(start_time_str, "%H:%M")
        except ValueError:
            current_time = datetime.strptime("18:00", "%H:%M")
            
        plan = []
        revision_hours = daily_hours * 0.5 # use half the daily hours for revision
        avg_rev_hours = revision_hours / len(subjects)
        avg_rev_mins = int(avg_rev_hours * 60)
        
        for i, s in enumerate(subjects):
            start_str = AIPlannerService.format_ist_time(current_time)
            current_time += timedelta(minutes=avg_rev_mins)
            end_str = AIPlannerService.format_ist_time(current_time)
            
            plan.append(PlanItem(
                subject=f"Revision: {s.name}", 
                allocated_hours=round(avg_rev_hours, 2),
                start_time=start_str,
                end_time=end_str,
                activity_type="study"
            ))
            
            if i < len(subjects) - 1:
                b_start_str = AIPlannerService.format_ist_time(current_time)
                current_time += timedelta(minutes=10)
                b_end_str = AIPlannerService.format_ist_time(current_time)
                
                plan.append(PlanItem(
                    subject="Break",
                    allocated_hours=round(10/60, 2),
                    start_time=b_start_str,
                    end_time=b_end_str,
                    activity_type="break"
                ))
        
        return plan
        
    @staticmethod
    def generate_plan(subjects: List[Subject], daily_hours: float, exam_date: str, start_time_str: str = "18:00") -> PlannerResponse:
        daily_plan = AIPlannerService.allocate_hours(subjects, daily_hours, start_time_str)
        
        # Weekly plan is just 7x daily plan but without strict times for simplicity, or we just copy the daily plan structure.
        # Let's just create a generic weekly overview list
        weekly_plan = [PlanItem(subject=s.name, allocated_hours=0) for s in subjects] # Placeholder
        
        revision_plan = AIPlannerService.generate_revision_schedule(subjects, daily_hours, start_time_str)
        
        return PlannerResponse(
            daily_plan=daily_plan,
            weekly_plan=weekly_plan,
            revision_plan=revision_plan
        )

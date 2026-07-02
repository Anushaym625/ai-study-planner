from datetime import datetime, timedelta
from typing import List

class Subject:
    def __init__(self, name, priority, difficulty):
        self.name = name
        self.priority = priority
        self.difficulty = difficulty

class AIPlannerService:
    @staticmethod
    def calculate_weight(priority: int, difficulty: int) -> int:
        return priority * difficulty

    @staticmethod
    def format_ist_time(dt: datetime) -> str:
        return dt.strftime("%I:%M %p")

    @staticmethod
    def allocate_hours(subjects: List[Subject], daily_hours: float, start_time_str: str):
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
            
            start_str = AIPlannerService.format_ist_time(current_time)
            current_time += timedelta(minutes=allocated_minutes)
            end_str = AIPlannerService.format_ist_time(current_time)
            
            plan.append({
                "subject": s.name, 
                "allocated_hours": round(allocated, 2),
                "allocated_minutes": allocated_minutes,
                "start_time": start_str,
                "end_time": end_str,
                "activity_type": "study"
            })

            if i < len(subjects) - 1:
                b_start_str = AIPlannerService.format_ist_time(current_time)
                current_time += timedelta(minutes=10)
                b_end_str = AIPlannerService.format_ist_time(current_time)
                
                plan.append({
                    "subject": "Break",
                    "allocated_hours": round(10/60, 2),
                    "start_time": b_start_str,
                    "end_time": b_end_str,
                    "activity_type": "break"
                })
        
        return plan

subs = [Subject("Math", 5, 5), Subject("Physics", 4, 4), Subject("Chemistry", 3, 3)]
print(AIPlannerService.allocate_hours(subs, 4, "18:00"))

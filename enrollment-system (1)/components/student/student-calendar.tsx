"use client";

/**
 * Student Calendar Component
 *
 * This component displays an academic calendar with important dates such as:
 * - Enrollment periods
 * - Exam schedules
 * - Holidays and breaks
 * - School events
 *
 * Features:
 * - Month and week view options
 * - Navigation controls (prev/next month, today button)
 * - Event details on click
 * - Color-coded events by category
 */

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, addDays, isToday, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Types
type CalendarEvent = {
  id: string;
  title: string;
  date: string; // ISO date string
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  category: "academic" | "exam" | "holiday" | "enrollment" | "event";
};

// Sample calendar events
const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Enrollment Period Begins",
    date: "2023-12-01",
    category: "enrollment",
    description: "Start of enrollment for the next semester. Make sure to meet with your academic advisor before enrolling."
  },
  {
    id: "2",
    title: "Enrollment Period Ends",
    date: "2023-12-15",
    category: "enrollment",
    description: "Last day to enroll for the next semester. Late enrollment will incur additional fees."
  },
  {
    id: "3",
    title: "Midterm Exams",
    date: "2023-12-05",
    startTime: "08:00",
    endTime: "17:00",
    category: "exam",
    description: "Midterm examinations for all courses. Check with your instructors for specific exam schedules."
  },
  {
    id: "4",
    title: "Christmas Break",
    date: "2023-12-24",
    category: "holiday",
    description: "Start of Christmas break. Classes will resume on January 3."
  },
  {
    id: "5",
    title: "New Year's Day",
    date: "2024-01-01",
    category: "holiday",
    description: "New Year's Day holiday. Campus will be closed."
  },
  {
    id: "6",
    title: "Classes Resume",
    date: "2024-01-03",
    category: "academic",
    description: "Classes resume after Christmas break."
  },
  {
    id: "7",
    title: "Final Exams",
    date: "2024-01-15",
    startTime: "08:00",
    endTime: "17:00",
    category: "exam",
    description: "Final examinations for all courses. Check with your instructors for specific exam schedules."
  },
  {
    id: "8",
    title: "Semester Break",
    date: "2024-01-25",
    category: "holiday",
    description: "Start of semester break. Classes for the next semester will begin on February 5."
  },
  {
    id: "9",
    title: "University Foundation Day",
    date: "2024-02-10",
    category: "event",
    location: "University Grounds",
    description: "Annual celebration of the university's founding. Various activities and events will be held throughout the day."
  },
  {
    id: "10",
    title: "Career Fair",
    date: "2024-02-15",
    startTime: "09:00",
    endTime: "16:00",
    location: "University Gymnasium",
    category: "event",
    description: "Annual career fair with representatives from various companies and organizations. Bring your resume and dress professionally."
  }
];

// Helper functions
const getCategoryColor = (category: string): string => {
  switch (category) {
    case "academic":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "exam":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "holiday":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "enrollment":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "event":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

export function StudentCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<"month" | "week">("month");
  
  // Get days for the current month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const monthDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });
  
  // Get days for the current week view
  const weekStart = startOfWeek(selectedDate || currentDate);
  const weekEnd = endOfWeek(weekStart);
  
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  });
  
  // Navigation functions
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };
  
  // Get events for a specific day
  const getEventsForDay = (day: Date): CalendarEvent[] => {
    return sampleEvents.filter(event => 
      isSameDay(parseISO(event.date), day)
    );
  };
  
  // Handle day click
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    if (view === "month") {
      // If clicking on a day in a different month, navigate to that month
      if (!isSameMonth(day, currentDate)) {
        setCurrentDate(day);
      }
    }
  };
  
  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Academic Calendar</h2>
          <p className="text-muted-foreground">
            View important academic dates and events
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            {format(currentDate, "MMMM yyyy")}
          </div>
        </div>
      </div>
      
      <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week")}>
        <TabsList>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
        </TabsList>
        
        <TabsContent value="month" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-7 gap-px bg-muted text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="py-2 text-sm font-medium">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px bg-muted">
                {monthDays.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                  const isTodayDate = isToday(day);
                  
                  return (
                    <div
                      key={day.toString()}
                      className={`min-h-[100px] p-2 bg-card ${
                        !isCurrentMonth ? "text-muted-foreground" : ""
                      } ${isSelected ? "bg-accent" : ""}`}
                      onClick={() => handleDayClick(day)}
                    >
                      <div className={`flex justify-center items-center h-8 w-8 mx-auto mb-1 rounded-full ${
                        isTodayDate
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}>
                        {format(day, "d")}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer ${getCategoryColor(
                              event.category
                            )}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="week" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-7 gap-px bg-muted text-center">
                {weekDays.map((day) => (
                  <div key={day.toString()} className="py-2">
                    <div className="text-sm font-medium">
                      {format(day, "EEE")}
                    </div>
                    <div
                      className={`flex justify-center items-center h-8 w-8 mx-auto mt-1 rounded-full ${
                        isToday(day)
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px bg-muted">
                {weekDays.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  
                  return (
                    <div
                      key={day.toString()}
                      className="min-h-[300px] p-2 bg-card"
                    >
                      <div className="space-y-2">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`text-sm p-2 rounded cursor-pointer ${getCategoryColor(
                              event.category
                            )}`}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            {event.startTime && (
                              <div className="text-xs flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {event.startTime}
                                {event.endTime && ` - ${event.endTime}`}
                              </div>
                            )}
                            {event.location && (
                              <div className="text-xs flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        ))}
                        {dayEvents.length === 0 && (
                          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                            No events
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Event details dialog */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <DialogDescription>
                <Badge className={`mt-2 ${getCategoryColor(selectedEvent.category)}`}>
                  {selectedEvent.category.charAt(0).toUpperCase() + selectedEvent.category.slice(1)}
                </Badge>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Date</div>
                  <div>{format(parseISO(selectedEvent.date), "MMMM d, yyyy")}</div>
                </div>
              </div>
              
              {selectedEvent.startTime && (
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Time</div>
                    <div>
                      {selectedEvent.startTime}
                      {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                    </div>
                  </div>
                </div>
              )}
              
              {selectedEvent.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div>{selectedEvent.location}</div>
                  </div>
                </div>
              )}
              
              {selectedEvent.description && (
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Description</div>
                    <div>{selectedEvent.description}</div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Legend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Event Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge className={getCategoryColor("academic")}>Academic</Badge>
            <Badge className={getCategoryColor("exam")}>Exam</Badge>
            <Badge className={getCategoryColor("holiday")}>Holiday</Badge>
            <Badge className={getCategoryColor("enrollment")}>Enrollment</Badge>
            <Badge className={getCategoryColor("event")}>Event</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

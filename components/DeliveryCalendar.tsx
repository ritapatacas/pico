// components/DeliveryCalendar.tsx

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type DeliveryOption = {
  date: string;
  slot: 1 | 2 | 3 | 4;
  price: number;
  available: boolean;
};

type Props = {
  options: DeliveryOption[];
  onSelect: (day: string, slot: 1 | 2 | 3 | 4) => void;
};

import { useState } from "react";

export default function DeliveryCalendar({ options, onSelect }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const availableDays = Array.from(
    new Set(options.map((opt) => opt.date))
  );

  const handleDayClick = (day: Date | undefined) => {
    if (!day) return;
    const iso = day.toISOString().split("T")[0];
    if (availableDays.includes(iso)) {
      setSelectedDate(iso);
    }
  };

  const selectedDaySlots = options.filter((opt) => opt.date === selectedDate);

  return (
    <div className="space-y-6">
      <DayPicker
        mode="single"
        onDayClick={handleDayClick}
        modifiers={{
          available: availableDays.map((d) => new Date(d)),
        }}
        modifiersStyles={{
          available: { backgroundColor: "#d1fae5" },

        }}
        disabled={(date) => {
          const iso = date.toISOString().split("T")[0];
          return !availableDays.includes(iso);
        }}
      />

      {selectedDate && (
        <div>
          <h3 className="text-md font-semibold mb-2">
            ⏱️ Slots para {selectedDate}:
          </h3>
          <ul className="space-y-2">
            {selectedDaySlots.map((slot, idx) => (
              <li
                key={idx}
                onClick={() => onSelect(slot.date, slot.slot)}
                className="cursor-pointer p-3 border rounded hover:bg-blue-50 transition"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{slot.slot}</span>
                  <span className="text-sm text-gray-600">
                    {slot.price.toFixed(2)} €
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

import { format } from "date-fns";
import React, { useEffect, useState } from "react";

interface DateProps {
  titulo?: string;
  classname?: string;
  classname2?: string;
  setData?: (data: Date) => void;
  dataMin?: Date;
  dataMax?: Date;
  valor?: any;
}

export default function DatePicker(props: DateProps) {
  const [valor, setValor] = useState(new Date(0));

  useEffect(() => {
    function isTimestamp(value: any) {
      return (
        value &&
        typeof value === 'object' &&
        value.seconds !== undefined &&
        value.nanoseconds !== undefined &&
        value.toDate !== undefined &&
        typeof value.toDate === 'function'
      );
    }

    if (isTimestamp(props.valor)) {
      setValor(
        new Date(
          (props.valor?.seconds ?? 0) * 1000 +
            ((props.valor?.nanoseconds ?? 0) / 1000000),
        ),
      );
    } else {
      setValor(props.valor);
    }
  }, [props.valor]);

  const [selectedDate, setSelectedDate] = useState<string>(
    valor ? format(valor, 'yyyy-MM-dd') : '',
  );

  useEffect(() => {
    if (valor && valor.getTime() !== 0) {
      setSelectedDate(format(valor, 'yyyy-MM-dd'));
    } else {
      setSelectedDate(''); // Definir como uma string vazia quando não houver valor
    }
  }, [valor]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateString = e.target.value;

    if (selectedDateString) {
      const selectedDateObj = new Date(selectedDateString + 'T00:00:00Z');

      if (!isNaN(selectedDateObj.getTime())) {
        setSelectedDate(selectedDateString);

        if (props.setData) {
          const newDate = new Date(selectedDateObj);
          newDate.setDate(newDate.getDate() + 1);
          props.setData(newDate);
        }
      }
    }
  };

  return (
    <div className={`pb-5 ${props.classname} text-black`}>
      <label className="font-Montserrat" htmlFor="data">
        {props.titulo}
      </label>
      <br />
      <input
        type="date"
        id="date"
        name="calendario"
        value={selectedDate}
        min={props.dataMin ? format(props.dataMin, 'yyyy-MM-dd') : '1950-01-01'}
        max={props.dataMax ? format(props.dataMax, 'yyyy-MM-dd') : '2100-12-31'}
        className={`bg-gray-200 rounded-md p-1 px-2 ${props.classname2}`}
        onChange={handleDateChange}
      />
    </div>
  );
}


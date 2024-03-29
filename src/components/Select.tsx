import { useState } from "react";

interface SelectProps{
    seletor: any
    titulo?: string
    classname?: string
    classname2?: string
    cor?: string
    setFiltro?: (filtro: string) => void
    filtro?: string
}

export default function Select(props: SelectProps) {
    const [value, setValue] = useState(props.filtro ?? "");
    const cor = (props.cor ?? "white")

    function aoAlterar(e:any){
      setValue(e.target.value);
      props.setFiltro?.(e.target.value)
    }

    
    return (
      <div className={`text-black ${props.classname2}`}>
        <h3 className="m-5 mb-2 mt-3 font-semibold ">{props.titulo}</h3>
        <select
        className={`ml-6 p-2 mb-4 w-fit mr-4 bg-blue-400 rounded-lg text-${cor} font-semibold outline-0 ${props.classname}`}
         value={value}
         onChange={(e) => {
        aoAlterar(e);
    }}
>
{props.seletor.map((opcao: any, index: any) => (
  <option key={index} value={opcao}>
    {opcao}
  </option>
))}

</select>
      </div>
    );
  }
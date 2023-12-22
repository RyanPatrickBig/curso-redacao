interface EntradaProps{
    texto: string;
    tipo?: 'text' | 'number' | 'password' | 'file' | 'email'
    valor?: any;
    somenteLeitura?: boolean;
    valorMudou: (e: any) => void;
    placeholder?: string;
    className?: any;
    className2?: any;
    pattern?: any;
}

export default function Entrada(props: EntradaProps){
    return (
        <div className={`flex flex-col ${props.className} text-black`}>
            <label className="font-Montserrant">
                {props.texto}
            </label>
            <input 
                pattern={props.pattern ?? ''}
                type={props.tipo ?? 'text'}
                value={props.valor}
                readOnly={props.somenteLeitura}
                onChange={e => props.valorMudou?.(e)}
                className={`
                    border-b border-black focus:outline-none py-1 px-5 mb-7
                    ${props.somenteLeitura ? '' : 'focus:bg-slate-50'}
                    ${props.className2}
                `}
                placeholder={props.placeholder ?? 'Digite sua resposta'} />
        </div>
    )
};


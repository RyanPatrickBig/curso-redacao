interface PerfilProps{
    min?: number
    max?: number
    texto?: string
    tipo?: 'text' | 'number' | 'password' | 'file'
    valor?: any
    somenteLeitura?: boolean
    obrigatorio?: boolean
    valorMudou?: (valor: any) => void
    placeholder?: string
    className?: any
    className2?: any
    pattern?: RegExp;
}

export default function PerfilDados(props: PerfilProps){
    return (
        <div className={`flex flex-col ${props.className} text-black`}>
            <label className="font-Montserrant">
                {props.texto}
            </label>
            <input 
                min={props.min}
                max={props.max}
                type={props.tipo ?? 'text'}
                value={props.valor ?? ''}
                readOnly={props.somenteLeitura}
                required={props.obrigatorio}
                onChange={e => props.valorMudou?.(e.target.value)}
                className={`
                    border-none bg-slate-200 rounded-sm
                    focus:outline-none py-1 px-5 mb-4 mr-8 
                    ${props.somenteLeitura == true ? '' : 'focus:bg-slate-50'}
                    ${props.className2}
                `}
                placeholder={props.placeholder ?? '...'} 
                pattern={props.pattern?.source} />
        </div>
    )
}
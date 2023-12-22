import React from 'react';

interface ModalAlunoMaterialProps {
    objeto: any;
    exclusao: (id: any) => void;
}

export default function ModalAlunoMaterial(props: ModalAlunoMaterialProps) {

    return (
        <div className="bg-white flex justify-center rounded-lg p-3">
            <button onClick={() => props.exclusao(props.objeto)} className="bg-red-500 text-white font-bold p-3 rounded-lg">
            Sim, excluir
            </button>
        </div>
    );
}

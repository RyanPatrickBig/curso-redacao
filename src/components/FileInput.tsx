import { useRef, useState } from "react";

interface PropsArquivo {
  setArquivo?: (arquivo: any) => void;
  className?: any
}

export default function DragAndDrop(props: PropsArquivo) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prevState) => [...prevState, ...selectedFiles]);

      if (props.setArquivo) {
        props.setArquivo(selectedFiles);
      }
    }
  }

  function handleSubmitFile(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) {
      // Nenhum arquivo foi enviado
    } else {
      // Lógica de envio aqui
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prevState) => [...prevState, ...droppedFiles]);

      if (props.setArquivo) {
        props.setArquivo(droppedFiles);
      }
    }
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function removeFile(fileName: string, idx: number) {
    const newArr = [...files];
    newArr.splice(idx, 1);
    setFiles(newArr);
  }

  function openFileExplorer() {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  }

  return (
    <div className={`flex flex-col items-start justify-center md:ml-10 ml-5 w-full ${props.className}`}>
      <h3 className="font-Montserrant">Arquivos</h3>
      <form
        className={`${
          dragActive ? "bg-slate-400" : "bg-slate-200"
        } p-4 w-4/5 rounded-lg min-h-[9rem] text-center flex flex-col items-center justify-center`}
        onDragEnter={handleDragEnter}
        onSubmit={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        <input
          placeholder="fileInput"
          className="hidden"
          ref={inputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
        />

        <p>
          Solte os arquivos aqui ou{" "}
          <span
            className="font-bold text-blue-600 cursor-pointer"
            onClick={openFileExplorer}
          >
            <u>Selecione arquivos</u>
          </span>{" "}
          para upload
        </p>

        <div className="flex flex-col items-center p-3">
          {files.map((file: File, idx: number) => (
            <div key={idx} className="flex flex-row space-x-5">
              <span>{file.name}</span>
              <span
                className="text-red-500 cursor-pointer"
                onClick={() => removeFile(file.name, idx)}
              >
                remover
              </span>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}

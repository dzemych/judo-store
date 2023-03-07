import { createContext } from "react";


interface IRecordContext {
   recordType: 'update' | 'create'
}

const RecordContext = createContext<IRecordContext>({
   recordType: 'update'
})

export default RecordContext
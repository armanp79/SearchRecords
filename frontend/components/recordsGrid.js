
import RecordCard from './recordCard.js';

export default function RecordsGrid(props) {
    return (    
        <div className="grid grid-cols-4 gap-4 p-10">
            {props.records.map((element, index) => <RecordCard key={index} element={element}/>)}
        </div>
    )
  }
  


export default function RecordCard(props) {
    var record = props.element;
    return (
        <div className="w-86 bg-slate-800 p-5 rounded-lg hover:bg-red-700">
            <div className="text-2xl text-center py-6">
                {record.first_name + ' ' + record.last_name}
            </div>
            <div className="flex justify-between text-sm py-3">
                <div>{record.age} years old</div>
                <div>SSN: {record.ssn}</div>
            </div>
            <br/>
            <div className="text-sm border-t-2 border-neutral-100 py-3 dark:border-neutral-600">
                <div>{record.address_street + ', ' + record.address_city}</div>
                <div>{record.address_state + ', ' + record.address_zip}</div>
            </div>
        </div>
        
    )
  }
  
const FaceCount = ({ name, entries }) => {
    return (
        <div>
            <div className='white f3'>
                {`${name[0].toUpperCase()+name.slice(1)}, your current entry count is...`}
            </div>
            <div className='white f1'>
                {entries}
            </div>
        </div>
    );
};

export default FaceCount;
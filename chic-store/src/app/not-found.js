import Image from "next/image"


const NotFound = () => {
  return (
    <div>
      <h1>Resource does not exist!</h1>
      <Image 
        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGE0aHF3bGFscHVmaGh2YWhrbWdnbnVuZ3ZqZWo1bWc3eWg4dHFycSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/g01ZnwAUvutuK8GIQn/giphy.gif" 
        width={700}
        height={500}
        alt="Travolta not found" />
    </div>
  )
}


export default NotFound;
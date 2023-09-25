export default function EmptyList({ text }: { text: string }) {
   return <div className="w-fit mx-auto mt-32">
      <div className="w-[300px] mx-auto">
         <img src="/images/illustrations/No data-pana.svg" alt="Empty chat illustration" />
      </div>
      <p className="text-center w-[300px]">{text}</p>
   </div>
}
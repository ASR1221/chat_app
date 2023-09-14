function OptionsIcon({ clickFunc }: { clickFunc: () => void}) {
   return <button onClick={clickFunc} className="grid grid-cols-1 gap-2 justify-center items-center p-1 min-w-[40px] max-w-[45px]">
      <div className="h-[2px] rounded-[2px] bg-convo-header-text-color"></div>
      <div className="h-[2px] rounded-[2px] bg-convo-header-text-color"></div>
      <div className="h-[2px] rounded-[2px] bg-convo-header-text-color"></div>
   </button>;
}

export default OptionsIcon;
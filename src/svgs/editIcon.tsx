function EditIcon({ isDark, width }: { isDark: boolean, width: number }) {
   return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256" width={`${width}px`} height={`${width}px`}>
      <g fill={isDark ? "#ffffff" : "#000000"} fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{mixBlendMode: "normal"}}>
         <g transform="scale(4,4)">
            <path d="M22,51c-1,-1 -4,-1 -4,-1l-0.425,-1.274c-0.362,-1.086 -1.215,-1.939 -2.301,-2.301l-1.274,-0.425c0,0 0.5,-2.5 -1,-4l25,-25l8,10zM52,21l-9,-9l4.68,-4.68c0,0 3.5,-1.5 7,2c3.5,3.5 2,7 2,7zM9,50l-1.843,4.476c-0.614,1.49 0.877,2.981 2.367,2.367l4.476,-1.843z"></path>
         </g>
      </g>
   </svg>;
}

export default EditIcon;
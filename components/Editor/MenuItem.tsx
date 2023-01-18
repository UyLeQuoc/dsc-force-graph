import Image from 'next/image'

export default ({
  icon, title, action, isActive = null,
} : any) => (
  <button
    className={`menu-item${isActive && isActive() ? ' is-active' : ''} bg-transparent rounded-md text-black h-6 mr-1 p-1 w-6 
      hover:bg-black
    `}
    onClick={action}
    title={title}
  >
    <Image src={`/icons/${icon}.svg`} alt={`${icon}.svg`} height={18} width={18} />
  </button>
)
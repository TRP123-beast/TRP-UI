import { Bath, BedDouble, SquareIcon } from "lucide-react"

interface PropertyIconsProps {
  beds: number
  baths: number
  sqft?: string
  className?: string
  iconSize?: number
  textClassName?: string
}

export function PropertyIcons({
  beds,
  baths,
  sqft,
  className = "",
  iconSize = 20,
  textClassName = "",
}: PropertyIconsProps) {
  return (
    <div className={`flex items-center gap-4 flex-wrap ${className}`}>
      {beds > 0 && (
        <div className="flex items-center gap-2">
          <BedDouble size={iconSize} className="text-futuristic-light" strokeWidth={1.5} />
          <span className={`text-futuristic-medium font-quicksand ${textClassName}`}>
            {beds} {beds === 1 ? "Bed" : "Beds"}
          </span>
        </div>
      )}

      {baths > 0 && (
        <div className="flex items-center gap-2">
          <Bath size={iconSize} className="text-futuristic-light" strokeWidth={1.5} />
          <span className={`text-futuristic-medium font-quicksand ${textClassName}`}>
            {baths} {baths === 1 ? "Bath" : "Baths"}
          </span>
        </div>
      )}

      {sqft && (
        <div className="flex items-center gap-2">
          <SquareIcon size={iconSize} className="text-futuristic-light" strokeWidth={1.5} />
          <span className={`text-futuristic-medium font-quicksand ${textClassName}`}>{sqft} sqft</span>
        </div>
      )}
    </div>
  )
}

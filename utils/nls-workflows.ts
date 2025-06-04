/**
 * NLS (Non-Leaseholder) Workflow Configurations
 * This file contains all NLS workflow mappings, questions, and result codes
 */

// NLS Workflow Types
export type NLSWorkflowType = "NLS1" | "NLS2" | "NLS3"

// NLS Employment Types
export type NLSEmploymentType =
  | "Full-Time"
  | "Part-Time"
  | "Self-Employed"
  | "Retired"
  | "Unemployed"
  | "Full-Time, Part-Time"
  | "Full-Time, Self-Employed"
  | "Part-Time, Self-Employed"
  | "Full-Time, Part-Time, Self-Employed"

// Credit Score Ranges
export type CreditScoreRange = "760-900" | "725-760" | "660-725" | "550-660" | "300-560" | "unknown"

// Credit Report Status
export type CreditReportStatus = "yes" | "no" | "not-in-canada"

// Student Status
export type StudentStatus = "yes" | "no"

// International Student Status
export type InternationalStatus = "yes" | "no"

// NLS Workflow Configuration Interface
export interface NLSWorkflowConfig {
  workflowType: NLSWorkflowType
  employmentType: NLSEmploymentType
  studentStatus: StudentStatus
  internationalStatus?: InternationalStatus
  creditReportStatus: CreditReportStatus
  creditScoreRange?: CreditScoreRange
  resultCode: string
}

// NLS Question Flow Interface
export interface NLSQuestionFlow {
  id: string
  question: string
  type: "radio" | "select" | "slider"
  options?: string[]
  required: boolean
  dependsOn?: string
  dependsOnValue?: string
}

// NLS1 Workflow Mappings (1 occupant, no invite)
export const NLS1_WORKFLOWS: Record<string, Record<string, string>> = {
  "Retired_Yes": {
    "760-900_yes": "V_NLS165",
    "760-900_no": "V_NLS166",
    "550-660_yes": "V_NLS167",
    "550-660_no": "V_NLS168",
    "300-560_yes": "V_NLS169",
    "300-560_no": "V_NLS170",
    "unknown_yes": "V_NLS171",
    "unknown_no": "V_NLS172",
    "notInCanada_yes": "V_NLS171",
    "notInCanada_no": "V_NLS172",
    "660-725": "V_NLS3",
    "unknown": "V_NLS4",
    "notInCanada": "V_NLS5"
  },
  "Unemployed_Yes": {
    "760-900_yes": "V_NLS173",
    "760-900_no": "V_NLS174",
    "550-660_yes": "V_NLS175",
    "550-660_no": "V_NLS176",
    "300-560_yes": "V_NLS177",
    "300-560_no": "V_NLS178",
    "unknown_yes": "V_NLS179",
    "unknown_no": "V_NLS180",
    "notInCanada_yes": "V_NLS179",
    "notInCanada_no": "V_NLS180",
    "660-725": "V_NLS6",
    "unknown": "V_NLS7",
    "notInCanada": "V_NLS8"
  },
  "Full-Time_Yes": {
    "760-900_yes": "V_NLS181",
    "760-900_no": "V_NLS182",
    "550-660_yes": "V_NLS183",
    "550-660_no": "V_NLS184",
    "300-560_yes": "V_NLS185",
    "300-560_no": "V_NLS186",
    "unknown_yes": "V_NLS187",
    "unknown_no": "V_NLS188",
    "notInCanada_yes": "V_NLS187",
    "notInCanada_no": "V_NLS188",
    "660-725": "V_NLS9",
    "unknown": "V_NLS10",
    "notInCanada": "V_NLS11"
  },
  "Part-Time_Yes": {
    "760-900_yes": "V_NLS189",
    "760-900_no": "V_NLS190",
    "550-660_yes": "V_NLS191",
    "550-660_no": "V_NLS192",
    "300-560_yes": "V_NLS193",
    "300-560_no": "V_NLS194",
    "unknown_yes": "V_NLS195",
    "unknown_no": "V_NLS196",
    "notInCanada_yes": "V_NLS195",
    "notInCanada_no": "V_NLS196",
    "660-725": "V_NLS12",
    "unknown": "V_NLS13",
    "notInCanada": "V_NLS14"
  },
  "Self-Employed_Yes": {
    "760-900_yes": "V_NLS197",
    "760-900_no": "V_NLS198",
    "550-660_yes": "V_NLS199",
    "550-660_no": "V_NLS200",
    "300-560_yes": "V_NLS201",
    "300-560_no": "V_NLS202",
    "unknown_yes": "V_NLS203",
    "unknown_no": "V_NLS204",
    "notInCanada_yes": "V_NLS203",
    "notInCanada_no": "V_NLS204",
    "660-725": "V_NLS15",
    "unknown": "V_NLS16",
    "notInCanada": "V_NLS17"
  },
  "Full-Time, Part-Time_Yes": {
    "760-900_yes": "V_NLS205",
    "760-900_no": "V_NLS206",
    "550-660_yes": "V_NLS207",
    "550-660_no": "V_NLS208",
    "300-560_yes": "V_NLS209",
    "300-560_no": "V_NLS210",
    "unknown_yes": "V_NLS211",
    "unknown_no": "V_NLS212",
    "notInCanada_yes": "V_NLS211",
    "notInCanada_no": "V_NLS212",
    "660-725": "V_NLS18",
    "unknown": "V_NLS19",
    "notInCanada": "V_NLS20"
  },
  "Full-Time, Self-Employed_Yes": {
    "760-900_yes": "V_NLS213",
    "760-900_no": "V_NLS214",
    "550-660_yes": "V_NLS215",
    "550-660_no": "V_NLS216",
    "300-560_yes": "V_NLS217",
    "300-560_no": "V_NLS218",
    "unknown_yes": "V_NLS219",
    "unknown_no": "V_NLS220",
    "notInCanada_yes": "V_NLS219",
    "notInCanada_no": "V_NLS220",
    "660-725": "V_NLS21",
    "unknown": "V_NLS22",
    "notInCanada": "V_NLS23"
  },
  "Part-Time, Self-Employed_Yes": {
    "760-900_yes": "V_NLS221",
    "760-900_no": "V_NLS222",
    "550-660_yes": "V_NLS223",
    "550-660_no": "V_NLS224",
    "300-560_yes": "V_NLS225",
    "300-560_no": "V_NLS226",
    "unknown_yes": "V_NLS227",
    "unknown_no": "V_NLS228",
    "notInCanada_yes": "V_NLS227",
    "notInCanada_no": "V_NLS228",
    "660-725": "V_NLS24",
    "unknown": "V_NLS25",
    "notInCanada": "V_NLS26"
  },
  "Full-Time, Part-Time, Self-Employed_Yes": {
    "760-900_yes": "V_NLS229",
    "760-900_no": "V_NLS230",
    "550-660_yes": "V_NLS231",
    "550-660_no": "V_NLS232",
    "300-560_yes": "V_NLS233",
    "300-560_no": "V_NLS234",
    "unknown_yes": "V_NLS235",
    "unknown_no": "V_NLS236",
    "notInCanada_yes": "V_NLS235",
    "notInCanada_no": "V_NLS236",
    "660-725": "V_NLS27",
    "unknown": "V_NLS28",
    "notInCanada": "V_NLS29"
  },
  "Part-Time_No": {
    "760-900_yes": "V_NLS237",
    "760-900_no": "V_NLS238",
    "550-660_yes": "V_NLS239",
    "550-660_no": "V_NLS240",
    "300-560_yes": "V_NLS241",
    "300-560_no": "V_NLS242",
    "unknown_yes": "V_NLS243",
    "unknown_no": "V_NLS244",
    "notInCanada_yes": "V_NLS243",
    "notInCanada_no": "V_NLS244",
    "660-725": "V_NLS30",
    "unknown": "V_NLS31",
    "notInCanada": "V_NLS32"
  },
  "Full-Time_No": {
    "760-900_yes": "V_NLS245",
    "760-900_no": "V_NLS246",
    "550-660_yes": "V_NLS247",
    "550-660_no": "V_NLS248",
    "300-560_yes": "V_NLS249",
    "300-560_no": "V_NLS250",
    "unknown_yes": "V_NLS251",
    "unknown_no": "V_NLS252",
    "notInCanada_yes": "V_NLS251",
    "notInCanada_no": "V_NLS252",
    "660-725": "V_NLS33",
    "unknown": "V_NLS34",
    "notInCanada": "V_NLS35"
  },
  "Self-Employed_No": {
    "760-900_yes": "V_NLS253",
    "760-900_no": "V_NLS254",
    "550-660_yes": "V_NLS255",
    "550-660_no": "V_NLS256",
    "300-560_yes": "V_NLS257",
    "300-560_no": "V_NLS258",
    "unknown_yes": "V_NLS259",
    "unknown_no": "V_NLS260",
    "notInCanada_yes": "V_NLS259",
    "notInCanada_no": "V_NLS260",
    "660-725": "V_NLS36",
    "unknown": "V_NLS37",
    "notInCanada": "V_NLS38"
  },
  "Retired_No": {
    "760-900_yes": "V_NLS261",
    "760-900_no": "V_NLS262",
    "550-660_yes": "V_NLS263",
    "550-660_no": "V_NLS264",
    "300-560_yes": "V_NLS265",
    "300-560_no": "V_NLS266",
    "unknown_yes": "V_NLS267",
    "unknown_no": "V_NLS268",
    "notInCanada_yes": "V_NLS267",
    "notInCanada_no": "V_NLS268",
    "660-725": "V_NLS39",
    "unknown": "V_NLS40",
    "notInCanada": "V_NLS41"
  },
  "Unemployed_No": {
    "760-900_yes": "V_NLS269",
    "760-900_no": "V_NLS270",
    "550-660_yes": "V_NLS271",
    "550-660_no": "V_NLS272",
    "300-560_yes": "V_NLS273",
    "300-560_no": "V_NLS274",
    "unknown_yes": "V_NLS275",
    "unknown_no": "V_NLS276",
    "notInCanada_yes": "V_NLS275",
    "notInCanada_no": "V_NLS276",
    "660-725": "V_NLS42",
    "unknown": "V_NLS43",
    "notInCanada": "V_NLS44"
  },
  "Full-Time, Part-Time, Self-Employed_No": {
    "760-900_yes": "V_NLS277",
    "760-900_no": "V_NLS278",
    "550-660_yes": "V_NLS279",
    "550-660_no": "V_NLS280",
    "300-560_yes": "V_NLS281",
    "300-560_no": "V_NLS282",
    "unknown_yes": "V_NLS283",
    "unknown_no": "V_NLS284",
    "notInCanada_yes": "V_NLS283",
    "notInCanada_no": "V_NLS284",
    "660-725": "V_NLS45",
    "unknown": "V_NLS46",
    "notInCanada": "V_NLS47"
  },
  "Full-Time, Part-Time_No": {
    "760-900_yes": "V_NLS285",
    "760-900_no": "V_NLS286",
    "550-660_yes": "V_NLS287",
    "550-660_no": "V_NLS288",
    "300-560_yes": "V_NLS289",
    "300-560_no": "V_NLS290",
    "unknown_yes": "V_NLS291",
    "unknown_no": "V_NLS292",
    "notInCanada_yes": "V_NLS291",
    "notInCanada_no": "V_NLS292",
    "660-725": "V_NLS48",
    "unknown": "V_NLS49",
    "notInCanada": "V_NLS50"
  },
  "Full-Time, Self-Employed_No": {
    "760-900_yes": "V_NLS293",
    "760-900_no": "V_NLS294",
    "550-660_yes": "V_NLS295",
    "550-660_no": "V_NLS296",
    "300-560_yes": "V_NLS297",
    "300-560_no": "V_NLS298",
    "unknown_yes": "V_NLS299",
    "unknown_no": "V_NLS300",
    "notInCanada_yes": "V_NLS299",
    "notInCanada_no": "V_NLS300",
    "660-725": "V_NLS51",
    "unknown": "V_NLS52",
    "notInCanada": "V_NLS53"
  },
  "Part-Time, Self-Employed_No": {
    "760-900_yes": "V_NLS301",
    "760-900_no": "V_NLS302",
    "550-660_yes": "V_NLS303",
    "550-660_no": "V_NLS304",
    "300-560_yes": "V_NLS305",
    "300-560_no": "V_NLS306",
    "unknown_yes": "V_NLS307",
    "unknown_no": "V_NLS308",
    "notInCanada_yes": "V_NLS307",
    "notInCanada_no": "V_NLS308",
    "660-725": "V_NLS54",
    "unknown": "V_NLS55",
    "notInCanada": "V_NLS56"
  }
}

// NLS2 Workflow Mappings (2+ occupants, no invite)
export const NLS2_WORKFLOWS: Record<string, Record<string, string>> = {
  "Retired_Yes": {
    // CS_NLS73 (ET_NLS73)
    "760-900_yes": "V_NLS309",
    "760-900_no": "V_NLS310",
    "550-660_yes": "V_NLS311",
    "550-660_no": "V_NLS312",
    "300-560_yes": "V_NLS313",
    "300-560_no": "V_NLS314",
    "unknown_yes": "V_NLS313",
    "unknown_no": "V_NLS314",
    "notInCanada_yes": "V_NLS315",
    "notInCanada_no": "V_NLS316"
  },
  "Unemployed_Yes": {
    // CS_NLS74 (ET_NLS74)
    "760-900_yes": "V_NLS317",
    "760-900_no": "V_NLS318",
    "550-660_yes": "V_NLS319",
    "550-660_no": "V_NLS320",
    "300-560_yes": "V_NLS321",
    "300-560_no": "V_NLS322",
    "unknown_yes": "V_NLS321",
    "unknown_no": "V_NLS322",
    "notInCanada_yes": "V_NLS323",
    "notInCanada_no": "V_NLS324"
  },
  "Full-Time_Yes": {
    // CS_NLS75 (ET_NLS75) - Not responsible for rent, deposit question applies
    "760-900_yes": "V_NLS325",
    "760-900_no": "V_NLS326",
    "550-660_yes": "V_NLS327",
    "550-660_no": "V_NLS328",
    "300-560_yes": "V_NLS329",
    "300-560_no": "V_NLS330",
    "unknown_yes": "V_NLS329",
    "unknown_no": "V_NLS330",
    "notInCanada_yes": "V_NLS331",
    "notInCanada_no": "V_NLS332"
  },
  "Part-Time_Yes": {
    // CS_NLS76 (ET_NLS76)
    "760-900_yes": "V_NLS333",
    "760-900_no": "V_NLS334",
    "550-660_yes": "V_NLS335",
    "550-660_no": "V_NLS336",
    "300-560_yes": "V_NLS337",
    "300-560_no": "V_NLS338",
    "unknown_yes": "V_NLS337",
    "unknown_no": "V_NLS338",
    "notInCanada_yes": "V_NLS339",
    "notInCanada_no": "V_NLS340"
  },
  "Self-Employed_Yes": {
    // CS_NLS77 (ET_NLS77)
    "760-900_yes": "V_NLS341",
    "760-900_no": "V_NLS342",
    "550-660_yes": "V_NLS343",
    "550-660_no": "V_NLS344",
    "300-560_yes": "V_NLS345",
    "300-560_no": "V_NLS346",
    "unknown_yes": "V_NLS345",
    "unknown_no": "V_NLS346",
    "notInCanada_yes": "V_NLS347",
    "notInCanada_no": "V_NLS348"
  },
  "Full-Time, Part-Time_Yes": {
    // CS_NLS78 (ET_NLS78)
    "760-900_yes": "V_NLS349",
    "760-900_no": "V_NLS350",
    "550-660_yes": "V_NLS351",
    "550-660_no": "V_NLS352",
    "300-560_yes": "V_NLS353",
    "300-560_no": "V_NLS354",
    "unknown_yes": "V_NLS353",
    "unknown_no": "V_NLS354",
    "notInCanada_yes": "V_NLS355",
    "notInCanada_no": "V_NLS356"
  },
  "Full-Time, Self-Employed_Yes": {
    // CS_NLS79 (ET_NLS79)
    "760-900_yes": "V_NLS357",
    "760-900_no": "V_NLS358",
    "550-660_yes": "V_NLS359",
    "550-660_no": "V_NLS360",
    "300-560_yes": "V_NLS361",
    "300-560_no": "V_NLS362",
    "unknown_yes": "V_NLS361",
    "unknown_no": "V_NLS362",
    "notInCanada_yes": "V_NLS363",
    "notInCanada_no": "V_NLS364"
  },
  "Part-Time, Self-Employed_Yes": {
    // CS_NLS80 (ET_NLS80)
    "760-900_yes": "V_NLS365",
    "760-900_no": "V_NLS366",
    "550-660_yes": "V_NLS367",
    "550-660_no": "V_NLS368",
    "300-560_yes": "V_NLS369",
    "300-560_no": "V_NLS370",
    "unknown_yes": "V_NLS369",
    "unknown_no": "V_NLS370",
    "notInCanada_yes": "V_NLS371",
    "notInCanada_no": "V_NLS372"
  },
  "Full-Time, Part-Time, Self-Employed_Yes": {
    // CS_NLS81 (ET_NLS81)
    "760-900_yes": "V_NLS373",
    "760-900_no": "V_NLS374",
    "550-660_yes": "V_NLS375",
    "550-660_no": "V_NLS376",
    "300-560_yes": "V_NLS377",
    "300-560_no": "V_NLS378",
    "unknown_yes": "V_NLS377",
    "unknown_no": "V_NLS378",
    "notInCanada_yes": "V_NLS379",
    "notInCanada_no": "V_NLS380"
  },
  "Part-Time_No": {
    // CS_NLS82 (ET_NLS82)
    "760-900_yes": "V_NLS381",
    "760-900_no": "V_NLS382",
    "550-660_yes": "V_NLS383",
    "550-660_no": "V_NLS384",
    "300-560_yes": "V_NLS385",
    "300-560_no": "V_NLS386",
    "unknown_yes": "V_NLS385",
    "unknown_no": "V_NLS386",
    "notInCanada_yes": "V_NLS387",
    "notInCanada_no": "V_NLS388"
  },
  "Full-Time_No": {
    // CS_NLS83 (ET_NLS83)
    "760-900_yes": "V_NLS389",
    "760-900_no": "V_NLS390",
    "550-660_yes": "V_NLS391",
    "550-660_no": "V_NLS392",
    "300-560_yes": "V_NLS393",
    "300-560_no": "V_NLS394",
    "unknown_yes": "V_NLS393",
    "unknown_no": "V_NLS394",
    "notInCanada_yes": "V_NLS395",
    "notInCanada_no": "V_NLS396"
  },
  "Self-Employed_No": {
    // CS_NLS84 (ET_NLS84)
    "760-900_yes": "V_NLS397",
    "760-900_no": "V_NLS398",
    "550-660_yes": "V_NLS399",
    "550-660_no": "V_NLS400",
    "300-560_yes": "V_NLS401",
    "300-560_no": "V_NLS402",
    "unknown_yes": "V_NLS401",
    "unknown_no": "V_NLS402",
    "notInCanada_yes": "V_NLS403",
    "notInCanada_no": "V_NLS404"
  },
  "Retired_No": {
    // CS_NLS85 (ET_NLS85)
    "760-900_yes": "V_NLS405",
    "760-900_no": "V_NLS406",
    "550-660_yes": "V_NLS407",
    "550-660_no": "V_NLS408",
    "300-560_yes": "V_NLS409",
    "300-560_no": "V_NLS410",
    "unknown_yes": "V_NLS409",
    "unknown_no": "V_NLS410",
    "notInCanada_yes": "V_NLS411",
    "notInCanada_no": "V_NLS412"
  },
  "Unemployed_No": {
    // CS_NLS86 (ET_NLS86)
    "760-900_yes": "V_NLS413",
    "760-900_no": "V_NLS414",
    "550-660_yes": "V_NLS415",
    "550-660_no": "V_NLS416",
    "300-560_yes": "V_NLS417",
    "300-560_no": "V_NLS418",
    "unknown_yes": "V_NLS417",
    "unknown_no": "V_NLS418",
    "notInCanada_yes": "V_NLS419",
    "notInCanada_no": "V_NLS420"
  },
  "Full-Time, Part-Time, Self-Employed_No": {
    // CS_NLS87 (ET_NLS87)
    "760-900_yes": "V_NLS421",
    "760-900_no": "V_NLS422",
    "550-660_yes": "V_NLS423",
    "550-660_no": "V_NLS424",
    "300-560_yes": "V_NLS425",
    "300-560_no": "V_NLS426",
    "unknown_yes": "V_NLS425",
    "unknown_no": "V_NLS426",
    "notInCanada_yes": "V_NLS427",
    "notInCanada_no": "V_NLS428"
  },
  "Full-Time, Part-Time_No": {
    // CS_NLS88 (ET_NLS88)
    "760-900_yes": "V_NLS429",
    "760-900_no": "V_NLS430",
    "550-660_yes": "V_NLS431",
    "550-660_no": "V_NLS432",
    "300-560_yes": "V_NLS433",
    "300-560_no": "V_NLS434",
    "unknown_yes": "V_NLS433",
    "unknown_no": "V_NLS434",
    "notInCanada_yes": "V_NLS435",
    "notInCanada_no": "V_NLS436"
  },
  "Full-Time, Self-Employed_No": {
    // CS_NLS89 (ET_NLS89)
    "760-900_yes": "V_NLS437",
    "760-900_no": "V_NLS438",
    "550-660_yes": "V_NLS439",
    "550-660_no": "V_NLS440",
    "300-560_yes": "V_NLS441",
    "300-560_no": "V_NLS442",
    "unknown_yes": "V_NLS441",
    "unknown_no": "V_NLS442",
    "notInCanada_yes": "V_NLS443",
    "notInCanada_no": "V_NLS444"
  },
  "Part-Time, Self-Employed_No": {
    // CS_NLS90 (ET_NLS90)
    "760-900_yes": "V_NLS445",
    "760-900_no": "V_NLS446",
    "550-660_yes": "V_NLS447",
    "550-660_no": "V_NLS448",
    "300-560_yes": "V_NLS449",
    "300-560_no": "V_NLS450",
    "unknown_yes": "V_NLS449",
    "unknown_no": "V_NLS450",
    "notInCanada_yes": "V_NLS451",
    "notInCanada_no": "V_NLS452"
  },
  // CS_NLS19-36 (Not Responsible for Rent)
  "Retired_Yes": {
    // CS_NLS19 (ET_NLS19)
    "660-725": "V_NLS57",
    "unknown": "V_NLS58",
    "notInCanada": "V_NLS59"
  },
  "Unemployed_Yes": {
    // CS_NLS20 (ET_NLS20)
    "660-725": "V_NLS60",
    "unknown": "V_NLS61",
    "notInCanada": "V_NLS62"
  },
  "Full-Time_Yes": {
    // CS_NLS21 (ET_NLS21)
    "660-725": "V_NLS63",
    "unknown": "V_NLS64",
    "notInCanada": "V_NLS65"
  },
  "Part-Time_Yes": {
    // CS_NLS22 (ET_NLS22)
    "660-725": "V_NLS66",
    "unknown": "V_NLS67",
    "notInCanada": "V_NLS68"
  },
  "Self-Employed_Yes": {
    // CS_NLS23 (ET_NLS23)
    "660-725": "V_NLS69",
    "unknown": "V_NLS70",
    "notInCanada": "V_NLS71"
  },
  "Full-Time, Part-Time_Yes": {
    // CS_NLS24 (ET_NLS24)
    "660-725": "V_NLS72",
    "unknown": "V_NLS73",
    "notInCanada": "V_NLS74"
  },
  "Full-Time, Self-Employed_Yes": {
    // CS_NLS25 (ET_NLS25)
    "660-725": "V_NLS75",
    "unknown": "V_NLS76",
    "notInCanada": "V_NLS77"
  },
  "Part-Time, Self-Employed_Yes": {
    // CS_NLS26 (ET_NLS26)
    "660-725": "V_NLS78",
    "unknown": "V_NLS79",
    "notInCanada": "V_NLS80"
  },
  "Full-Time, Part-Time, Self-Employed_Yes": {
    // CS_NLS27 (ET_NLS27)
    "660-725": "V_NLS81",
    "unknown": "V_NLS82",
    "notInCanada": "V_NLS83"
  },
  "Part-Time_No": {
    // CS_NLS28 (ET_NLS28)
    "660-725": "V_NLS84",
    "unknown": "V_NLS85",
    "notInCanada": "V_NLS86"
  },
  "Full-Time_No": {
    // CS_NLS29 (ET_NLS29)
    "660-725": "V_NLS87",
    "unknown": "V_NLS88",
    "notInCanada": "V_NLS89"
  },
  "Self-Employed_No": {
    // CS_NLS30 (ET_NLS30)
    "660-725": "V_NLS90",
    "unknown": "V_NLS91",
    "notInCanada": "V_NLS92"
  },
  "Retired_No": {
    // CS_NLS31 (ET_NLS31)
    "660-725": "V_NLS93",
    "unknown": "V_NLS94",
    "notInCanada": "V_NLS95"
  },
  "Unemployed_No": {
    // CS_NLS32 (ET_NLS32)
    "660-725": "V_NLS96",
    "unknown": "V_NLS97",
    "notInCanada": "V_NLS98"
  },
  "Full-Time, Part-Time, Self-Employed_No": {
    // CS_NLS33 (ET_NLS33)
    "660-725": "V_NLS99",
    "unknown": "V_NLS100",
    "notInCanada": "V_NLS101"
  },
  "Full-Time, Part-Time_No": {
    // CS_NLS34 (ET_NLS34)
    "660-725": "V_NLS102",
    "unknown": "V_NLS103",
    "notInCanada": "V_NLS104"
  },
  "Full-Time, Self-Employed_No": {
    // CS_NLS35 (ET_NLS35)
    "660-725": "V_NLS105",
    "unknown": "V_NLS106",
    "notInCanada": "V_NLS107"
  },
  "Part-Time, Self-Employed_No": {
    // CS_NLS36 (ET_NLS36)
    "660-725": "V_NLS108",
    "unknown": "V_NLS109",
    "notInCanada": "V_NLS110"
  }
}

// NLS3 Workflow Mappings (invited to group)
export const NLS3_WORKFLOWS: Record<string, Record<string, string>> = {
  // CS_NLS91 (ET_NLS91) - Responsible for Rent
  "Retired_Yes": {
    "760-900_yes": "V_NLS453",
    "760-900_no": "V_NLS454",
    "550-660_yes": "V_NLS455",
    "550-660_no": "V_NLS456",
    "300-560_yes": "V_NLS457",
    "300-560_no": "V_NLS458",
    "unknown_yes": "V_NLS457",
    "unknown_no": "V_NLS458",
    "notInCanada_yes": "V_NLS459",
    "notInCanada_no": "V_NLS460",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS92 (ET_NLS92)
  "Unemployed_Yes": {
    "760-900_yes": "V_NLS461",
    "760-900_no": "V_NLS462",
    "550-660_yes": "V_NLS463",
    "550-660_no": "V_NLS464",
    "300-560_yes": "V_NLS465",
    "300-560_no": "V_NLS466",
    "unknown_yes": "V_NLS465",
    "unknown_no": "V_NLS466",
    "notInCanada_yes": "V_NLS467",
    "notInCanada_no": "V_NLS468",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS93 (ET_NLS93)
  "Full-Time_Yes": {
    "760-900_yes": "V_NLS469",
    "760-900_no": "V_NLS470",
    "550-660_yes": "V_NLS471",
    "550-660_no": "V_NLS472",
    "300-560_yes": "V_NLS473",
    "300-560_no": "V_NLS474",
    "unknown_yes": "V_NLS473",
    "unknown_no": "V_NLS474",
    "notInCanada_yes": "V_NLS475",
    "notInCanada_no": "V_NLS476",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS94 (ET_NLS94)
  "Part-Time_Yes": {
    "760-900_yes": "V_NLS477",
    "760-900_no": "V_NLS478",
    "550-660_yes": "V_NLS479",
    "550-660_no": "V_NLS480",
    "300-560_yes": "V_NLS481",
    "300-560_no": "V_NLS482",
    "unknown_yes": "V_NLS481",
    "unknown_no": "V_NLS482",
    "notInCanada_yes": "V_NLS483",
    "notInCanada_no": "V_NLS484",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS95 (ET_NLS95)
  "Self-Employed_Yes": {
    "760-900_yes": "V_NLS485",
    "760-900_no": "V_NLS486",
    "550-660_yes": "V_NLS487",
    "550-660_no": "V_NLS488",
    "300-560_yes": "V_NLS489",
    "300-560_no": "V_NLS490",
    "unknown_yes": "V_NLS489",
    "unknown_no": "V_NLS490",
    "notInCanada_yes": "V_NLS491",
    "notInCanada_no": "V_NLS492",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS96 (ET_NLS96)
  "Full-Time, Part-Time_Yes": {
    "760-900_yes": "V_NLS493",
    "760-900_no": "V_NLS494",
    "550-660_yes": "V_NLS495",
    "550-660_no": "V_NLS496",
    "300-560_yes": "V_NLS497",
    "300-560_no": "V_NLS498",
    "unknown_yes": "V_NLS497",
    "unknown_no": "V_NLS498",
    "notInCanada_yes": "V_NLS499",
    "notInCanada_no": "V_NLS500",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS97 (ET_NLS97)
  "Full-Time, Self-Employed_Yes": {
    "760-900_yes": "V_NLS501",
    "760-900_no": "V_NLS502",
    "550-660_yes": "V_NLS503",
    "550-660_no": "V_NLS504",
    "300-560_yes": "V_NLS505",
    "300-560_no": "V_NLS506",
    "unknown_yes": "V_NLS505",
    "unknown_no": "V_NLS506",
    "notInCanada_yes": "V_NLS507",
    "notInCanada_no": "V_NLS508",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS98 (ET_NLS98)
  "Part-Time, Self-Employed_Yes": {
    "760-900_yes": "V_NLS509",
    "760-900_no": "V_NLS510",
    "550-660_yes": "V_NLS511",
    "550-660_no": "V_NLS512",
    "300-560_yes": "V_NLS513",
    "300-560_no": "V_NLS514",
    "unknown_yes": "V_NLS513",
    "unknown_no": "V_NLS514",
    "notInCanada_yes": "V_NLS515",
    "notInCanada_no": "V_NLS516",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS99 (ET_NLS99)
  "Full-Time, Part-Time, Self-Employed_Yes": {
    "760-900_yes": "V_NLS517",
    "760-900_no": "V_NLS518",
    "550-660_yes": "V_NLS519",
    "550-660_no": "V_NLS520",
    "300-560_yes": "V_NLS521",
    "300-560_no": "V_NLS522",
    "unknown_yes": "V_NLS521",
    "unknown_no": "V_NLS522",
    "notInCanada_yes": "V_NLS523",
    "notInCanada_no": "V_NLS524",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS100 (ET_NLS100)
  "Part-Time_No": {
    "760-900_yes": "V_NLS525",
    "760-900_no": "V_NLS526",
    "550-660_yes": "V_NLS527",
    "550-660_no": "V_NLS528",
    "300-560_yes": "V_NLS529",
    "300-560_no": "V_NLS530",
    "unknown_yes": "V_NLS529",
    "unknown_no": "V_NLS530",
    "notInCanada_yes": "V_NLS531",
    "notInCanada_no": "V_NLS532",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS101 (ET_NLS101)
  "Full-Time_No": {
    "760-900_yes": "V_NLS533",
    "760-900_no": "V_NLS534",
    "550-660_yes": "V_NLS535",
    "550-660_no": "V_NLS536",
    "300-560_yes": "V_NLS537",
    "300-560_no": "V_NLS538",
    "unknown_yes": "V_NLS537",
    "unknown_no": "V_NLS538",
    "notInCanada_yes": "V_NLS539",
    "notInCanada_no": "V_NLS540",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS102 (ET_NLS102)
  "Self-Employed_No": {
    "760-900_yes": "V_NLS541",
    "760-900_no": "V_NLS542",
    "550-660_yes": "V_NLS543",
    "550-660_no": "V_NLS544",
    "300-560_yes": "V_NLS545",
    "300-560_no": "V_NLS546",
    "unknown_yes": "V_NLS545",
    "unknown_no": "V_NLS546",
    "notInCanada_yes": "V_NLS547",
    "notInCanada_no": "V_NLS548",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS103 (ET_NLS103)
  "Retired_No": {
    "760-900_yes": "V_NLS549",
    "760-900_no": "V_NLS550",
    "550-660_yes": "V_NLS551",
    "550-660_no": "V_NLS552",
    "300-560_yes": "V_NLS553",
    "300-560_no": "V_NLS554",
    "unknown_yes": "V_NLS553",
    "unknown_no": "V_NLS554",
    "notInCanada_yes": "V_NLS555",
    "notInCanada_no": "V_NLS556",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS104 (ET_NLS104)
  "Unemployed_No": {
    "760-900_yes": "V_NLS557",
    "760-900_no": "V_NLS558",
    "550-660_yes": "V_NLS559",
    "550-660_no": "V_NLS560",
    "300-560_yes": "V_NLS561",
    "300-560_no": "V_NLS562",
    "unknown_yes": "V_NLS561",
    "unknown_no": "V_NLS562",
    "notInCanada_yes": "V_NLS563",
    "notInCanada_no": "V_NLS564",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS105 (ET_NLS105)
  "Full-Time, Part-Time, Self-Employed_No": {
    "760-900_yes": "V_NLS565",
    "760-900_no": "V_NLS566",
    "550-660_yes": "V_NLS567",
    "550-660_no": "V_NLS568",
    "300-560_yes": "V_NLS569",
    "300-560_no": "V_NLS570",
    "unknown_yes": "V_NLS569",
    "unknown_no": "V_NLS570",
    "notInCanada_yes": "V_NLS571",
    "notInCanada_no": "V_NLS572",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS106 (ET_NLS106)
  "Full-Time, Part-Time_No": {
    "760-900_yes": "V_NLS573",
    "760-900_no": "V_NLS574",
    "550-660_yes": "V_NLS575",
    "550-660_no": "V_NLS576",
    "300-560_yes": "V_NLS577",
    "300-560_no": "V_NLS578",
    "unknown_yes": "V_NLS577",
    "unknown_no": "V_NLS578",
    "notInCanada_yes": "V_NLS579",
    "notInCanada_no": "V_NLS580",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS107 (ET_NLS107)
  "Full-Time, Self-Employed_No": {
    "760-900_yes": "V_NLS581",
    "760-900_no": "V_NLS582",
    "550-660_yes": "V_NLS583",
    "550-660_no": "V_NLS584",
    "300-560_yes": "V_NLS585",
    "300-560_no": "V_NLS586",
    "unknown_yes": "V_NLS585",
    "unknown_no": "V_NLS586",
    "notInCanada_yes": "V_NLS587",
    "notInCanada_no": "V_NLS588",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS108 (ET_NLS108)
  "Part-Time, Self-Employed_No": {
    "760-900_yes": "V_NLS589",
    "760-900_no": "V_NLS590",
    "550-660_yes": "V_NLS591",
    "550-660_no": "V_NLS592",
    "300-560_yes": "V_NLS593",
    "300-560_no": "V_NLS594",
    "unknown_yes": "V_NLS593",
    "unknown_no": "V_NLS594",
    "notInCanada_yes": "V_NLS595",
    "notInCanada_no": "V_NLS596",
    "725-760": "QUALIFIED",
    "660-725": "QUALIFIED"
  },
  // CS_NLS37-54 (Not Responsible for Rent)
  "Retired_Yes": {
    // CS_NLS37 (ET_NLS37)
    "660-725": "V_NLS111",
    "unknown": "V_NLS112",
    "notInCanada": "V_NLS113"
  },
  "Unemployed_Yes": {
    // CS_NLS38 (ET_NLS38)
    "660-725": "V_NLS114",
    "unknown": "V_NLS115",
    "notInCanada": "V_NLS116"
  },
  "Full-Time_Yes": {
    // CS_NLS39 (ET_NLS39)
    "660-725": "V_NLS117",
    "unknown": "V_NLS118",
    "notInCanada": "V_NLS119"
  },
  "Part-Time_Yes": {
    // CS_NLS40 (ET_NLS40)
    "660-725": "V_NLS120",
    "unknown": "V_NLS121",
    "notInCanada": "V_NLS122"
  },
  "Self-Employed_Yes": {
    // CS_NLS41 (ET_NLS41) - Corrected "Self-Time" to "Self-Employed"
    "660-725": "V_NLS123",
    "unknown": "V_NLS124",
    "notInCanada": "V_NLS125"
  },
  "Full-Time, Part-Time_Yes": {
    // CS_NLS42 (ET_NLS42)
    "660-725": "V_NLS126",
    "unknown": "V_NLS127",
    "notInCanada": "V_NLS128"
  },
  "Full-Time, Self-Employed_Yes": {
    // CS_NLS43 (ET_NLS43)
    "660-725": "V_NLS129",
    "unknown": "V_NLS130",
    "notInCanada": "V_NLS131"
  },
  "Part-Time, Self-Employed_Yes": {
    // CS_NLS44 (ET_NLS44)
    "660-725": "V_NLS132",
    "unknown": "V_NLS133",
    "notInCanada": "V_NLS134"
  },
  "Full-Time, Part-Time, Self-Employed_Yes": {
    // CS_NLS45 (ET_NLS45)
    "660-725": "V_NLS135",
    "unknown": "V_NLS136",
    "notInCanada": "V_NLS137"
  },
  "Part-Time_No": {
    // CS_NLS46 (ET_NLS46)
    "660-725": "V_NLS138",
    "unknown": "V_NLS139",
    "notInCanada": "V_NLS140"
  },
  "Full-Time_No": {
    // CS_NLS47 (ET_NLS47)
    "660-725": "V_NLS141",
    "unknown": "V_NLS142",
    "notInCanada": "V_NLS143"
  },
  "Self-Employed_No": {
    // CS_NLS48 (ET_NLS48)
    "660-725": "V_NLS144",
    "unknown": "V_NLS145",
    "notInCanada": "V_NLS146"
  },
  "Retired_No": {
    // CS_NLS49 (ET_NLS49)
    "660-725": "V_NLS147",
    "unknown": "V_NLS148",
    "notInCanada": "V_NLS149"
  },
  "Unemployed_No": {
    // CS_NLS50 (ET_NLS50)
    "660-725": "V_NLS150",
    "unknown": "V_NLS151",
    "notInCanada": "V_NLS152"
  },
  "Full-Time, Part-Time, Self-Employed_No": {
    // CS_NLS51 (ET_NLS51)
    "660-725": "V_NLS153",
    "unknown": "V_NLS154",
    "notInCanada": "V_NLS155"
  },
  "Full-Time, Part-Time_No": {
    // CS_NLS52 (ET_NLS52)
    "660-725": "V_NLS156",
    "unknown": "V_NLS157",
    "notInCanada": "V_NLS158"
  },
  "Full-Time, Self-Employed_No": {
    // CS_NLS53 (ET_NLS53)
    "660-725": "V_NLS159",
    "unknown": "V_NLS160",
    "notInCanada": "V_NLS161"
  },
  "Part-Time, Self-Employed_No": {
    // CS_NLS54 (ET_NLS54)
    "660-725": "V_NLS162",
    "unknown": "V_NLS163",
    "notInCanada": "V_NLS164"
  }
}

// NLS Question Flow Configuration
export const NLS_QUESTION_FLOW: NLSQuestionFlow[] = [
  {
    id: "employment_type",
    question: "What is your employment type?",
    type: "select",
    options: [
      "Full-Time",
      "Part-Time",
      "Self-Employed",
      "Retired",
      "Unemployed",
      "Full-Time, Part-Time",
      "Full-Time, Self-Employed",
      "Part-Time, Self-Employed",
      "Full-Time, Part-Time, Self-Employed",
    ],
    required: true,
  },
  {
    id: "student_status",
    question: "Are you a student?",
    type: "radio",
    options: ["yes", "no"],
    required: true,
  },
  {
    id: "international_status",
    question: "Are you an international student?",
    type: "radio",
    options: ["yes", "no"],
    required: true,
    dependsOn: "student_status",
    dependsOnValue: "yes",
  },
  {
    id: "credit_report_status",
    question:
      'If you have been living in Canada for 12+ months, have you pulled your most recent detailed "paid" credit score and report from Equifax or TransUnion within the past 60 days?',
    type: "radio",
    options: ["yes", "no", "not-in-canada"],
    required: true,
  },
  {
    id: "credit_score_range",
    question: "What is your credit score range?",
    type: "radio",
    options: ["760-900", "725-760", "660-725", "550-660", "300-560", "unknown"],
    required: true,
    dependsOn: "credit_report_status",
    dependsOnValue: "yes",
  },
  {
    id: "deposit_capability",
    question:
      "In the event that you have already viewed properties with our Rental Specialists and are ready to submit an offer, the mandatory deposit requirement amount is the first and last month’s rent. In a multiple offer situation where there are competing tenants for the same property, would you be able to comfortably set aside more than the minimum required amount to give yourself a greater advantage in the offer presentation?",
    type: "radio",
    options: ["yes", "no"],
    required: true,
    dependsOn: "credit_score_range",
    dependsOnValue: "760-900" // Updated to reflect single value; logic already handles multiple conditions
  }
]

// NLS Workflow Resolver Function
export function resolveNLSWorkflow(
  workflowType: NLSWorkflowType,
  employmentType: NLSEmploymentType,
  studentStatus: StudentStatus,
  internationalStatus: InternationalStatus,
  creditReportStatus: CreditReportStatus,
  creditScoreRange?: CreditScoreRange,
  depositResponse?: string
): string {
  // Select the appropriate workflow mapping
  let workflowMapping: Record<string, Record<string, string>>

  switch (workflowType) {
    case "NLS1":
      workflowMapping = NLS1_WORKFLOWS
      break
    case "NLS2":
      workflowMapping = NLS2_WORKFLOWS
      break
    case "NLS3":
      workflowMapping = NLS3_WORKFLOWS
      break
    default:
      return "ERROR_INVALID_WORKFLOW_TYPE"
  }

  // Create workflow key
  const workflowKey = `${employmentType}_${studentStatus}`

  // Check if workflow exists
  if (!workflowMapping[workflowKey]) {
    return `ERROR_WORKFLOW_NOT_FOUND_${workflowKey}`
  }

  const currentWorkflow = workflowMapping[workflowKey]

  // Handle credit report status and score
  if (creditReportStatus === "not-in-canada") {
    if (depositResponse) {
      return currentWorkflow[`notInCanada_${depositResponse}`] || "ERROR_NOT_IN_CANADA_NOT_MAPPED"
    }
    return currentWorkflow["notInCanada"] || "ERROR_NOT_IN_CANADA_NOT_MAPPED"
  } else if (creditReportStatus === "yes" && creditScoreRange) {
    // Handle credit score ranges
    if (creditScoreRange === "725-760" || creditScoreRange === "660-725") {
      return currentWorkflow[creditScoreRange] || "QUALIFIED" // Auto-qualify for these ranges if not explicitly mapped
    } else {
      if (depositResponse) {
        return currentWorkflow[`${creditScoreRange}_${depositResponse}`] || "ERROR_CREDIT_SCORE_NOT_MAPPED"
      }
      return currentWorkflow[creditScoreRange] || "ERROR_CREDIT_SCORE_NOT_MAPPED"
    }
  } else if (creditReportStatus === "no") {
    // Handle no credit report scenario
    if (depositResponse) {
      return currentWorkflow[`unknown_${depositResponse}`] || "ERROR_NO_CREDIT_REPORT_NOT_MAPPED"
    }
    return currentWorkflow["unknown"] || "ERROR_NO_CREDIT_REPORT_NOT_MAPPED"
  }

  return "ERROR_INCOMPLETE_ASSESSMENT"
}

// NLS Workflow Validation Function
export function validateNLSWorkflowData(
  workflowType: NLSWorkflowType,
  employmentType: NLSEmploymentType,
  studentStatus: StudentStatus,
  internationalStatus: InternationalStatus,
  creditReportStatus: CreditReportStatus,
  creditScoreRange?: CreditScoreRange,
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validate required fields
  if (!workflowType) errors.push("Workflow type is required")
  if (!employmentType) errors.push("Employment type is required")
  if (!studentStatus) errors.push("Student status is required")
  if (!creditReportStatus) errors.push("Credit report status is required")

  // Validate conditional fields
  if (studentStatus === "yes" && !internationalStatus) {
    errors.push("International student status is required when student status is yes")
  }

  if (creditReportStatus === "yes" && !creditScoreRange) {
    errors.push("Credit score range is required when credit report status is yes")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Helper function to get workflow display name
export function getNLSWorkflowDisplayName(workflowType: NLSWorkflowType): string {
  switch (workflowType) {
    case "NLS1":
      return "Non-Leaseholder (1 occupant)"
    case "NLS2":
      return "Non-Leaseholder (2+ occupants)"
    case "NLS3":
      return "Non-Leaseholder (invited to group)"
    default:
      return "Unknown NLS Workflow"
  }
}

// Export all workflow mappings for easy access
export const ALL_NLS_WORKFLOWS = {
  NLS1: NLS1_WORKFLOWS,
  NLS2: NLS2_WORKFLOWS,
  NLS3: NLS3_WORKFLOWS,
}

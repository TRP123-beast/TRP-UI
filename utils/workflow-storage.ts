// Types for workflow data
export interface WorkflowData {
  flags: Record<string, boolean>
  userRole: string | null
  userRoleCode: string | null
  rentResponsibility: string | null
  employmentTypes: string[]
  employmentTypeCode: string | null
  leaseType: string | null
  leaseExpiryDate: string | null
  earliestMoveDate: string | null
  completedWorkflows: string[]
}

// Default workflow data
const defaultWorkflowData: WorkflowData = {
  flags: {},
  userRole: null,
  userRoleCode: null,
  rentResponsibility: null,
  employmentTypes: [],
  employmentTypeCode: null,
  leaseType: null,
  leaseExpiryDate: null,
  earliestMoveDate: null,
  completedWorkflows: [],
}

// Save workflow data to localStorage
export function saveWorkflowData(data: Partial<WorkflowData>): void {
  try {
    // Get existing data
    const existingData = getWorkflowData()

    // Merge with new data
    const mergedData = {
      ...existingData,
      ...data,
      // Special handling for flags and completedWorkflows (merge instead of replace)
      flags: { ...existingData.flags, ...(data.flags || {}) },
      completedWorkflows: [
        ...new Set([...(existingData.completedWorkflows || []), ...(data.completedWorkflows || [])]),
      ],
    }

    // Save to localStorage
    localStorage.setItem("workflowData", JSON.stringify(mergedData))
  } catch (error) {
    console.error("Error saving workflow data:", error)
  }
}

// Get workflow data from localStorage
export function getWorkflowData(): WorkflowData {
  try {
    const data = localStorage.getItem("workflowData")
    return data ? JSON.parse(data) : { ...defaultWorkflowData }
  } catch (error) {
    console.error("Error getting workflow data:", error)
    return { ...defaultWorkflowData }
  }
}

// Clear workflow data from localStorage
export function clearWorkflowData(): void {
  try {
    localStorage.removeItem("workflowData")
  } catch (error) {
    console.error("Error clearing workflow data:", error)
  }
}

// Get a specific flag value
export function getFlag(flagName: string): boolean {
  try {
    const data = getWorkflowData()
    return data.flags[flagName] || false
  } catch (error) {
    console.error(`Error getting flag ${flagName}:`, error)
    return false
  }
}

// Set a specific flag value
export function setFlag(flagName: string, value: boolean): void {
  try {
    const data = getWorkflowData()
    data.flags[flagName] = value
    saveWorkflowData({ flags: data.flags })
  } catch (error) {
    console.error(`Error setting flag ${flagName}:`, error)
  }
}

// Check if a workflow is completed
export function isWorkflowCompleted(workflowCode: string): boolean {
  try {
    const data = getWorkflowData()
    return data.completedWorkflows.includes(workflowCode)
  } catch (error) {
    console.error(`Error checking if workflow ${workflowCode} is completed:`, error)
    return false
  }
}

// Mark a workflow as completed
export function markWorkflowCompleted(workflowCode: string): void {
  try {
    const data = getWorkflowData()
    if (!data.completedWorkflows.includes(workflowCode)) {
      data.completedWorkflows.push(workflowCode)
      saveWorkflowData({ completedWorkflows: data.completedWorkflows })
    }
  } catch (error) {
    console.error(`Error marking workflow ${workflowCode} as completed:`, error)
  }
}

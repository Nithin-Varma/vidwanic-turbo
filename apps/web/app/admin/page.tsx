import { auth } from "../../auth"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/signin")
  }

  if (!session.user.isAdmin) {
    redirect("/auth/access-denied")
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Current User</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(session.user, null, 2)}
        </pre>
      </div>
    </div>
  )
}
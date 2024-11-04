import { NextRequest, NextResponse } from "next/server"
import { LoopsClient } from "loops"

const loops = new LoopsClient(process.env.LOOPS_API_KEY as string)

/**
 * Create or Update a contact
 */
export async function POST(request: NextRequest) {
  // Contact properties can be sent as JSON along with the email address

  const res = await request.json()

  const email = res["email"]
  //   const mailingLists = {
  //     clz9qxctw00gc0ll574tn7gb9: true,
  //     clza8804x00450ll77xp49yms: true,
  //   } as any

  try {
    const data = await loops.createContact(email, {
      userGroup: "Test",
      mailingLists: {
        clz9qxctw00gc0ll574tn7gb9: true,
        clza8804x00450ll77xp49yms: true,
      } as any,
    })
    console.log(data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error creating/updating contact:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create/update contact" },
      { status: 500 }
    )
  }
}

/**
 * Search for a contact by email
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query: string | null = searchParams.get("q")

  if (!query) throw "No email given"

  const data = await loops.findContact({ email: query })

  return NextResponse.json({ data })
}

/**
 * Delete a contact
 */
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const email: string | null = searchParams.get("email")

  if (!email) throw "No email given"

  const data = await loops.deleteContact({ email })

  return NextResponse.json({ data })
}

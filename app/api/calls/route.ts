import { NextRequest, NextResponse } from "next/server";

export interface Call {
  id: string;
  caller: {
    id: string;
    name: string;
    image?: string;
  };
  receiver: {
    id: string;
    name: string;
    image?: string;
  };
  status: "ringing" | "ongoing" | "ended" | "missed" | "rejected";
  type: "voice" | "video";
  startTime?: string;
  endTime?: string;
  duration?: number;
}

let activeCalls: Call[] = [];
let callHistory: Call[] = [];

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  const type = searchParams.get("type"); // "active" or "history"

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  if (type === "active") {
    const userCalls = activeCalls.filter(
      (call) => call.caller.id === userId || call.receiver.id === userId
    );
    return NextResponse.json(userCalls);
  }

  const userCallHistory = callHistory.filter(
    (call) => call.caller.id === userId || call.receiver.id === userId
  );
  return NextResponse.json(userCallHistory);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { callerId, receiverId, type } = data;

    if (!callerId || !receiverId) {
      return NextResponse.json(
        { error: "Caller ID and Receiver ID are required" },
        { status: 400 }
      );
    }

    const newCall: Call = {
      id: Math.random().toString(36).substring(7),
      caller: {
        id: callerId,
        name: "Caller Name", // Fetch from DB in real app
        image: "/placeholder.svg",
      },
      receiver: {
        id: receiverId,
        name: "Receiver Name", // Fetch from DB in real app
        image: "/placeholder.svg",
      },
      status: "ringing",
      type: type || "voice",
      startTime: new Date().toISOString(),
    };

    activeCalls.push(newCall);
    return NextResponse.json(newCall);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create call" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { callId, status } = data;

    if (!callId || !status) {
      return NextResponse.json(
        { error: "Call ID and status are required" },
        { status: 400 }
      );
    }

    const callIndex = activeCalls.findIndex((call) => call.id === callId);
    if (callIndex === -1) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    const call = activeCalls[callIndex];
    const updatedCall = { ...call, status };

    if (["ended", "missed", "rejected"].includes(status)) {
      updatedCall.endTime = new Date().toISOString();
      updatedCall.duration =
        new Date(updatedCall.endTime).getTime() -
        new Date(updatedCall.startTime!).getTime();

      activeCalls.splice(callIndex, 1);
      callHistory.push(updatedCall);
    } else {
      activeCalls[callIndex] = updatedCall;
    }

    return NextResponse.json(updatedCall);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update call" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const callId = searchParams.get("callId");

  if (!callId) {
    return NextResponse.json({ error: "Call ID is required" }, { status: 400 });
  }

  const callIndex = callHistory.findIndex((call) => call.id === callId);
  if (callIndex === -1) {
    return NextResponse.json({ error: "Call not found" }, { status: 404 });
  }

  callHistory.splice(callIndex, 1);
  return NextResponse.json({ success: true });
}

import { supabase } from "@/app/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ valid: false, message: "No API key provided" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, usage')
      .eq('value', apiKey)
      .limit(1)
      .single();

    if (error) {
      // If error is not found, it means the key is invalid
      if (error.code === 'PGRST116') {
        return NextResponse.json({ valid: false, message: "Invalid API key" }, { status: 200 });
      }
      
      // If any other error occurred
      return NextResponse.json({ valid: false, message: "Error validating key" }, { status: 500 });
    }

    // If we got here, the key exists
    // Increment usage count
    await supabase
      .from('api_keys')
      .update({ usage: (data.usage || 0) + 1 })
      .eq('id', data.id);

    return NextResponse.json({ valid: true, message: "API key is valid" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ valid: false, message: "Server error" }, { status: 500 });
  }
} 
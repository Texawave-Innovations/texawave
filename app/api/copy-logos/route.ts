import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  try {
    const src1 = "C:\\Users\\Ganesh\\.gemini\\antigravity-ide\\brain\\f5f16a3f-9443-4f8c-bec1-208263db406b\\inlab_logo_1783070841602.png";
    const src2 = "C:\\Users\\Ganesh\\.gemini\\antigravity-ide\\brain\\f5f16a3f-9443-4f8c-bec1-208263db406b\\sourcing_partner_logo_1783070853206.png";
    const src3 = "C:\\Users\\Ganesh\\.gemini\\antigravity-ide\\brain\\f5f16a3f-9443-4f8c-bec1-208263db406b\\shape_3dtech_logo_1783070869115.png";

    const dest1 = "d:\\TEXAWAVE\\TEXAWAVE WEBSITE\\Texawave Website\\public\\inlab_logo.png";
    const dest2 = "d:\\TEXAWAVE\\TEXAWAVE WEBSITE\\Texawave Website\\public\\sourcing_partner_logo.png";
    const dest3 = "d:\\TEXAWAVE\\TEXAWAVE WEBSITE\\Texawave Website\\public\\shape_3dtech_logo.png";

    fs.copyFileSync(src1, dest1);
    fs.copyFileSync(src2, dest2);
    fs.copyFileSync(src3, dest3);

    return NextResponse.json({ success: true, message: "Logos copied successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

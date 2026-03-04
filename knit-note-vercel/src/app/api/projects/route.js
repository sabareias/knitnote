import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { isAllowedCategory, isAllowedCraft } from "@/lib/validation";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const result = await query(
      `select id,
              title,
              category,
              craft,
              pattern,
              yarn,
              start_date,
              end_date,
              completed,
              progress,
              created_at
         from projects
        where user_id = $1
        order by id desc`,
      [userId]
    );

    const projects = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      craft: row.craft,
      pattern: row.pattern,
      yarn: row.yarn,
      startDate: row.start_date,
      endDate: row.end_date,
      completed: row.completed,
      progress: row.progress,
      created_at: row.created_at,
    }));

    return NextResponse.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await request.json();
    const { title, category, craft, pattern, yarn, startDate, endDate } = body;

    const trimmedTitle = title?.trim();
    const trimmedPattern = pattern ? pattern.trim() : "";
    const trimmedYarn = yarn ? yarn.trim() : "";
    const start = startDate || null;
    const end = endDate || null;

    if (!trimmedTitle || trimmedTitle.length < 3) {
      return NextResponse.json(
        { error: "Project title must be at least 3 characters long." },
        { status: 400 }
      );
    }
    if (trimmedTitle.length > 100) {
      return NextResponse.json(
        { error: "Project title must not exceed 100 characters." },
        { status: 400 }
      );
    }
    if (!category) {
      return NextResponse.json(
        { error: "Category is required." },
        { status: 400 }
      );
    }
    if (!isAllowedCategory(category)) {
      return NextResponse.json(
        { error: "Invalid category." },
        { status: 400 }
      );
    }
    if (!craft) {
      return NextResponse.json(
        { error: "Craft type is required." },
        { status: 400 }
      );
    }
    if (!isAllowedCraft(craft)) {
      return NextResponse.json(
        { error: "Invalid craft type." },
        { status: 400 }
      );
    }
    if (trimmedPattern) {
      if (trimmedPattern.length < 3) {
        return NextResponse.json(
          { error: "Pattern name must be at least 3 characters long." },
          { status: 400 }
        );
      }
      if (trimmedPattern.length > 100) {
        return NextResponse.json(
          { error: "Pattern must not exceed 100 characters." },
          { status: 400 }
        );
      }
    }
    if (trimmedYarn) {
      if (trimmedYarn.length < 3) {
        return NextResponse.json(
          { error: "Yarn name must be at least 3 characters long." },
          { status: 400 }
        );
      }
      if (trimmedYarn.length > 100) {
        return NextResponse.json(
          { error: "Yarn must not exceed 100 characters." },
          { status: 400 }
        );
      }
    }
    if (start && end && new Date(start) > new Date(end)) {
      return NextResponse.json(
        { error: "Start date cannot be later than end date." },
        { status: 400 }
      );
    }

    const completedBool = !!end;
    const progressBool = !!start && !end;

    const insertResult = await query(
      `insert into projects
         (title,
          category,
          craft,
          pattern,
          yarn,
          start_date,
          end_date,
          completed,
          progress,
          user_id)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       returning id, created_at`,
      [
        trimmedTitle,
        category,
        craft,
        trimmedPattern,
        trimmedYarn,
        start,
        end,
        completedBool,
        progressBool,
        userId,
      ]
    );

    const row = insertResult.rows[0];

    return NextResponse.json(
      {
        id: row.id,
        title: trimmedTitle,
        category,
        craft,
        pattern: trimmedPattern,
        yarn: trimmedYarn,
        startDate: start,
        endDate: end,
        completed: completedBool,
        progress: progressBool,
        created_at: row.created_at,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error inserting project:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}


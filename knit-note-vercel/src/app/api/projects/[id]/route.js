import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { isAllowedCategory, isAllowedCraft } from "@/lib/validation";

export async function DELETE(_request, { params }) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const { id: idParam } = await params;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const result = await query(
      "delete from projects where id = $1 and user_id = $2",
      [id, userId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted" });
  } catch (err) {
    console.error("Error deleting project:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const { id: idParam } = await params;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      title,
      category,
      craft,
      pattern,
      yarn,
      startDate,
      endDate,
      completed,
      progress,
    } = body;

    const normalizedStartDate =
      startDate === "" || startDate === "( no date set )" ? null : startDate;
    const normalizedEndDate =
      endDate === "" || endDate === "( no date set )" ? null : endDate;

    const fields = [];
    const values = [];
    let idx = 1;

    if (title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(title.trim());
    }
    if (category !== undefined) {
      if (!isAllowedCategory(category)) {
        return NextResponse.json(
          { error: "Invalid category." },
          { status: 400 }
        );
      }
      fields.push(`category = $${idx++}`);
      values.push(category);
    }
    if (craft !== undefined) {
      if (!isAllowedCraft(craft)) {
        return NextResponse.json(
          { error: "Invalid craft type." },
          { status: 400 }
        );
      }
      fields.push(`craft = $${idx++}`);
      values.push(craft);
    }
    if (pattern !== undefined) {
      fields.push(`pattern = $${idx++}`);
      values.push(pattern.trim());
    }
    if (yarn !== undefined) {
      fields.push(`yarn = $${idx++}`);
      values.push(yarn.trim());
    }
    if (startDate !== undefined) {
      fields.push(`start_date = $${idx++}`);
      values.push(normalizedStartDate);
    }
    if (endDate !== undefined) {
      fields.push(`end_date = $${idx++}`);
      values.push(normalizedEndDate);
    }
    if (completed !== undefined) {
      fields.push(`completed = $${idx++}`);
      values.push(!!completed);
    }
    if (progress !== undefined) {
      fields.push(`progress = $${idx++}`);
      values.push(!!progress);
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(id, userId);

    const sql = `update projects set ${fields.join(", ")} where id = $${idx++} and user_id = $${idx++}`;
    await query(sql, values);

    const result = await query(
      "select * from projects where id = $1 and user_id = $2",
      [id, userId]
    );
    const project = result.rows[0];

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: project.id,
      title: project.title,
      category: project.category,
      craft: project.craft,
      pattern: project.pattern,
      yarn: project.yarn,
      startDate: project.start_date,
      endDate: project.end_date,
      completed: project.completed,
      progress: project.progress,
      created_at: project.created_at,
    });
  } catch (err) {
    console.error("Error updating project:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


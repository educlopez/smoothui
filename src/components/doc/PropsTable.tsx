import React from "react"

interface FieldDefinition {
  name: string
  type: string
  description?: string
}

interface PropDefinition {
  name: string
  type: string
  description?: string
  required?: boolean
  fields?: FieldDefinition[]
}

interface PropsTableProps {
  props: PropDefinition[]
}

const PropsTable: React.FC<PropsTableProps> = ({ props }) => (
  <div className="bg-primary overflow-x-auto rounded-lg border">
    <table className="min-w-full text-left text-sm">
      <thead className="bg-primary">
        <tr>
          <th className="text-foreground px-4 py-2 font-semibold">Prop</th>
          <th className="text-foreground px-4 py-2 font-semibold">Type</th>
          <th className="text-foreground px-4 py-2 font-semibold">
            Description
          </th>
        </tr>
      </thead>
      <tbody>
        {props.map((prop) => (
          <React.Fragment key={prop.name}>
            <tr className="border-t">
              <td className="px-4 py-2 align-top">
                <span className="text-candy bg-background inline-block rounded border px-2 py-0.5 font-mono text-xs">
                  {prop.name}
                  {prop.required ? "" : "?"}
                </span>
              </td>
              <td className="px-4 py-2 align-top">
                <span className="bg-background text-foreground inline-block rounded border px-2 py-0.5 font-mono text-xs">
                  {prop.type}
                </span>
              </td>
              <td className="text-primary-foreground px-4 py-2 align-top">
                {prop.description || "-"}
                {prop.fields && (
                  <div className="mt-2">
                    <div className="text-foreground mb-1 text-xs font-semibold">
                      Object shape:
                    </div>
                    <div className="w-fit overflow-hidden rounded-sm border">
                      <table className="bg-primary min-w-[300px] text-xs">
                        <thead className="bg-primary">
                          <tr>
                            <th className="text-foreground px-2 py-1 font-semibold">
                              Field
                            </th>
                            <th className="text-foreground px-2 py-1 font-semibold">
                              Type
                            </th>
                            <th className="text-foreground px-2 py-1 font-semibold">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {prop.fields.map((field) => (
                            <tr key={field.name} className="border-t">
                              <td className="text-candy bg-background px-2 py-1 font-mono">
                                {field.name}
                              </td>
                              <td className="text-foreground bg-background px-2 py-1 font-mono">
                                {field.type}
                              </td>
                              <td className="text-primary-foreground bg-background px-2 py-1">
                                {field.description || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
)

export default PropsTable

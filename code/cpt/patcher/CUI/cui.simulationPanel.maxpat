{
	"patcher" : 	{
		"fileversion" : 1,
		"appversion" : 		{
			"major" : 7,
			"minor" : 3,
			"revision" : 3,
			"architecture" : "x64",
			"modernui" : 1
		}
,
		"rect" : [ 34.0, 78.0, 1349.0, 747.0 ],
		"bglocked" : 0,
		"openinpresentation" : 1,
		"default_fontsize" : 12.0,
		"default_fontface" : 0,
		"default_fontname" : "Arial",
		"gridonopen" : 1,
		"gridsize" : [ 15.0, 15.0 ],
		"gridsnaponopen" : 1,
		"objectsnaponopen" : 1,
		"statusbarvisible" : 2,
		"toolbarvisible" : 1,
		"lefttoolbarpinned" : 0,
		"toptoolbarpinned" : 0,
		"righttoolbarpinned" : 0,
		"bottomtoolbarpinned" : 0,
		"toolbars_unpinned_last_save" : 0,
		"tallnewobj" : 0,
		"boxanimatetime" : 200,
		"enablehscroll" : 1,
		"enablevscroll" : 1,
		"devicewidth" : 0.0,
		"description" : "",
		"digest" : "",
		"tags" : "",
		"style" : "",
		"subpatcher_template" : "",
		"boxes" : [ 			{
				"box" : 				{
					"id" : "obj-8",
					"maxclass" : "fpic",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "jit_matrix" ],
					"patching_rect" : [ 629.0, 530.0, 100.0, 50.0 ],
					"pic" : "cpt-woz-icon_256px.png",
					"presentation" : 1,
					"presentation_rect" : [ 1044.304199, 511.0, 259.0, 168.597534 ]
				}

			}
, 			{
				"box" : 				{
					"angle" : 270.0,
					"bgcolor" : [ 0.290196, 0.309804, 0.301961, 0.0 ],
					"border" : 1,
					"bordercolor" : [ 0.0, 0.0, 0.0, 1.0 ],
					"id" : "obj-66",
					"maxclass" : "panel",
					"mode" : 0,
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 390.0, 496.0, 128.0, 128.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 384.304199, 409.5, 478.0, 51.0 ],
					"proportion" : 0.39,
					"style" : ""
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-36",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 840.0, 101.0, 107.0, 22.0 ],
					"style" : "",
					"text" : "loadmess compile"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-37",
					"maxclass" : "button",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"patching_rect" : [ 595.5, 278.0, 24.0, 24.0 ],
					"style" : ""
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-38",
					"maxclass" : "button",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"patching_rect" : [ 557.0, 182.0, 24.0, 24.0 ],
					"style" : ""
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-16",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"patching_rect" : [ 526.5, 234.0, 69.0, 22.0 ],
					"style" : "",
					"text" : "delay 1500"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-43",
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 680.0, 154.0, 79.5, 20.0 ],
					"style" : "",
					"text" : "open JSON"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-42",
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 662.0, 246.0, 45.0, 20.0 ],
					"style" : "",
					"text" : "create"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-2",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 650.0, 218.0, 114.0, 22.0 ],
					"style" : "",
					"text" : "prepend readJSON"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-29",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "bang" ],
					"patching_rect" : [ 650.0, 182.0, 105.0, 22.0 ],
					"style" : "",
					"text" : "opendialog JSON"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-1",
					"maxclass" : "button",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"patching_rect" : [ 718.0, 246.0, 24.0, 24.0 ],
					"style" : ""
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-23",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 650.0, 280.0, 189.0, 22.0 ],
					"saved_object_attributes" : 					{
						"filename" : "cui.generate.simulationPanel.js",
						"parameter_enable" : 0
					}
,
					"style" : "",
					"text" : "js cui.generate.simulationPanel.js"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-24",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 751.0, 248.0, 52.0, 22.0 ],
					"style" : "",
					"text" : "compile"
				}

			}
, 			{
				"box" : 				{
					"fontsize" : 16.0,
					"id" : "obj-39",
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 519.0, 18.0, 177.0, 24.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 460.304199, 423.5, 158.0, 24.0 ],
					"style" : "",
					"text" : "Generate Panel",
					"textjustification" : 1
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-3",
					"maxclass" : "textbutton",
					"numinlets" : 1,
					"numoutlets" : 3,
					"outlettype" : [ "", "", "int" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 519.0, 78.5, 177.0, 20.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 608.304199, 421.0, 156.25, 29.0 ],
					"style" : "",
					"text" : "Open PRT File"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 13.0,
					"id" : "obj-40",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 1015.0, 194.0, 105.0, 23.0 ],
					"style" : "",
					"text" : "prepend append"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 13.0,
					"id" : "obj-46",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 1015.0, 158.0, 80.0, 23.0 ],
					"style" : "",
					"text" : "relativepath"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 13.0,
					"id" : "obj-52",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 972.0, 224.0, 113.0, 23.0 ],
					"style" : "",
					"text" : "filepath search 20"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 11.595187,
					"id" : "obj-10",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 5,
					"outlettype" : [ "", "", "", "", "" ],
					"patching_rect" : [ 1015.0, 130.0, 80.0, 21.0 ],
					"style" : "",
					"text" : "regexp (.+)/.+"
				}

			}
, 			{
				"box" : 				{
					"bgmode" : 0,
					"border" : 0,
					"clickthrough" : 0,
					"enablehscroll" : 0,
					"enablevscroll" : 0,
					"id" : "obj-21",
					"lockeddragscroll" : 0,
					"maxclass" : "bpatcher",
					"name" : "cui.audio.send.maxpat",
					"numinlets" : 1,
					"numoutlets" : 0,
					"offset" : [ 0.0, 0.0 ],
					"patching_rect" : [ 18.0, 407.0, 181.0, 202.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 544.304199, 240.0, 158.0, 158.0 ],
					"viewvisibility" : 1
				}

			}
, 			{
				"box" : 				{
					"bgmode" : 0,
					"border" : 0,
					"clickthrough" : 0,
					"enablehscroll" : 0,
					"enablevscroll" : 0,
					"id" : "obj-20",
					"lockeddragscroll" : 0,
					"maxclass" : "bpatcher",
					"name" : "cui.audio.receive.maxpat",
					"numinlets" : 0,
					"numoutlets" : 2,
					"offset" : [ 0.0, 0.0 ],
					"outlettype" : [ "signal", "signal" ],
					"patching_rect" : [ 6.75, 78.5, 142.5, 146.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 384.304199, 240.0, 158.0, 158.0 ],
					"viewvisibility" : 1
				}

			}
, 			{
				"box" : 				{
					"bgmode" : 0,
					"border" : 0,
					"clickthrough" : 0,
					"enablehscroll" : 0,
					"enablevscroll" : 0,
					"id" : "obj-75",
					"lockeddragscroll" : 0,
					"maxclass" : "bpatcher",
					"name" : "cui.log.send.maxpat",
					"numinlets" : 0,
					"numoutlets" : 0,
					"offset" : [ 0.0, 0.0 ],
					"patching_rect" : [ 230.0, 59.0, 128.0, 128.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 704.304199, 240.0, 158.0, 158.0 ],
					"viewvisibility" : 1
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-256",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 25.0, 626.0, 143.0, 22.0 ],
					"style" : "",
					"text" : "cui.control.colourHandler"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-105",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 30.0, 708.0, 213.0, 22.0 ],
					"style" : "",
					"text" : "cui.log.commenter WOZ_OPERATOR"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-6",
					"maxclass" : "newobj",
					"numinlets" : 0,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 30.0, 671.5, 142.0, 22.0 ],
					"style" : "",
					"text" : "receive openCommenter"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-79",
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 32.25, 298.0, 283.0, 20.0 ],
					"style" : "",
					"text" : "Output phrases and send them back to the tester"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-13",
					"maxclass" : "meter~",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "float" ],
					"patching_rect" : [ 140.75, 369.0, 80.0, 13.0 ],
					"style" : ""
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-12",
					"maxclass" : "meter~",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "float" ],
					"patching_rect" : [ 32.25, 369.0, 80.0, 13.0 ],
					"style" : ""
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-7",
					"maxclass" : "ezdac~",
					"numinlets" : 2,
					"numoutlets" : 0,
					"patching_rect" : [ 234.25, 336.0, 45.0, 45.0 ],
					"style" : "",
					"varname" : "hoverTest"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"id" : "obj-5",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "signal" ],
					"patching_rect" : [ 140.75, 336.0, 79.0, 22.0 ],
					"style" : "",
					"text" : "receive~ cue"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"id" : "obj-4",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "signal" ],
					"patching_rect" : [ 32.25, 336.0, 87.0, 22.0 ],
					"style" : "",
					"text" : "receive~ room"
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"destination" : [ "obj-23", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"midpoints" : [ 727.5, 272.0, 659.5, 272.0 ],
					"source" : [ "obj-1", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-46", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"midpoints" : [ 1039.75, 152.0, 1024.5, 152.0 ],
					"source" : [ "obj-10", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-37", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-16", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-23", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"midpoints" : [ 659.5, 242.0, 659.5, 242.0 ],
					"source" : [ "obj-2", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-23", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"midpoints" : [ 760.5, 272.0, 659.5, 272.0 ],
					"source" : [ "obj-24", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-10", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"order" : 0,
					"source" : [ "obj-29", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-2", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"midpoints" : [ 659.5, 206.0, 659.5, 206.0 ],
					"order" : 1,
					"source" : [ "obj-29", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-38", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"order" : 2,
					"source" : [ "obj-29", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-24", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"order" : 0,
					"source" : [ "obj-3", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-29", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"order" : 1,
					"source" : [ "obj-3", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-23", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-36", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-23", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-37", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-16", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-38", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-12", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"midpoints" : [ 41.75, 360.0, 41.75, 360.0 ],
					"order" : 1,
					"source" : [ "obj-4", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-21", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"order" : 2,
					"source" : [ "obj-4", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-7", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"midpoints" : [ 41.75, 360.0, 19.25, 360.0, 19.25, 393.0, 229.25, 393.0, 229.25, 333.0, 243.75, 333.0 ],
					"order" : 0,
					"source" : [ "obj-4", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-52", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"midpoints" : [ 1024.5, 218.0, 981.5, 218.0 ],
					"source" : [ "obj-40", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-40", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"midpoints" : [ 1024.5, 182.0, 1024.5, 182.0 ],
					"source" : [ "obj-46", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-13", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"midpoints" : [ 150.25, 360.0, 150.25, 360.0 ],
					"order" : 1,
					"source" : [ "obj-5", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-7", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"midpoints" : [ 150.25, 360.0, 229.25, 360.0, 229.25, 333.0, 243.75, 333.0 ],
					"order" : 0,
					"source" : [ "obj-5", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-105", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-6", 0 ]
				}

			}
 ],
		"parameters" : 		{
			"obj-21::obj-18" : [ "number[3]", "number[8]", 0 ],
			"obj-75::obj-88" : [ "number[8]", "number[8]", 0 ],
			"obj-20::obj-88" : [ "number[2]", "number[8]", 0 ],
			"obj-21::obj-88" : [ "number[4]", "number[8]", 0 ],
			"obj-105::obj-3" : [ "live.toggle", "live.toggle", 0 ],
			"obj-75::obj-7" : [ "number[1]", "number[8]", 0 ]
		}
,
		"dependency_cache" : [ 			{
				"name" : "cui.log.commenter.maxpat",
				"bootpath" : "~/masterarbeit/20_prototyping/cui-prototyping-tool/patcher/CUI",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "cui.colour.handler.js",
				"bootpath" : "~/masterarbeit/20_prototyping/cui-prototyping-tool/patcher/CUI/scripts",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "cui.commenter.setup.js",
				"bootpath" : "~/masterarbeit/20_prototyping/cui-prototyping-tool/patcher/CUI/scripts",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "cui.control.colourHandler.maxpat",
				"bootpath" : "~/masterarbeit/20_prototyping/cui-prototyping-tool/patcher/CUI",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "cpt_colours",
				"bootpath" : "~/masterarbeit/20_prototyping/cui-prototyping-tool/patcher/CUI/files",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "cui.log.send.maxpat",
				"bootpath" : "~/masterarbeit/20_prototyping/cui-prototyping-tool/patcher/CUI",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "cui.networking.addressHelper.js",
				"bootpath" : "~/masterarbeit/20_prototyping/cui-prototyping-tool/patcher/CUI/scripts",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "cui.generate.initPort.js",
				"bootpath" : "~/masterarbeit/20_prototyping/cui-prototyping-tool/patcher/CUI/scripts",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "cui.audio.receive.maxpat",
				"bootpath" : "~/masterarbeit/20_prototyping/cui-prototyping-tool/patcher/CUI",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "cui.audio.send.maxpat",
				"bootpath" : "~/masterarbeit/20_prototyping/cui-prototyping-tool/patcher/CUI",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "cui.generate.simulationPanel.js",
				"bootpath" : "~/masterarbeit/20_prototyping/cui-prototyping-tool/patcher/CUI/scripts",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "cpt-woz-icon_256px.png",
				"bootpath" : "~/masterarbeit/20_prototyping/cui-prototyping-tool/img",
				"type" : "PNG ",
				"implicit" : 1
			}
 ],
		"autosave" : 0
	}

}

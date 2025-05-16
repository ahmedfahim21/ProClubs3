"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Shield, 
  Star, 
  Trophy, 
  Zap, 
  Flame, 
  Award, 
  Download, 
  RotateCw, 
  Undo, 
  Circle, 
  Square, 
  Triangle,
  Heart,
  Hexagon
} from "lucide-react"

interface LogoData {
  template: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  text: string
  emblem: string
  fontSize: number
  rotation: number
  borderWidth: number
  borderStyle: string
  shadow: boolean
  gradient: boolean
  gradientDirection: string
  textPosition: string
  fontFamily: string
  textTransform: string
}

interface LogoCustomizerStepProps {
  data: LogoData
  clubName: string
  primaryColor: string
  secondaryColor: string
  updateData: (data: LogoData) => void
  onNext: () => void
  onBack: () => void
}

export function LogoCustomizerStep({
  data,
  clubName,
  primaryColor,
  secondaryColor,
  updateData,
  onNext,
  onBack,
}: LogoCustomizerStepProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeTab, setActiveTab] = useState("template")
  const [history, setHistory] = useState<LogoData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Initialize with default values if not provided
  const initialData: LogoData = {
    template: "shield",
    primaryColor: "#ff0000",
    secondaryColor: "#ffffff",
    accentColor: "#ffd700",
    text: "",
    emblem: "star",
    fontSize: 10,
    rotation: 0,
    borderWidth: 10,
    borderStyle: "solid",
    shadow: false,
    gradient: false,
    gradientDirection: "vertical",
    textPosition: "bottom",
    fontFamily: "Arial",
    textTransform: "uppercase"
  }

  // Initialize with club colors if available
  useEffect(() => {
    const updatedData = { ...initialData };
    
    if (primaryColor) {
      updatedData.primaryColor = primaryColor;
    }
    
    if (secondaryColor) {
      updatedData.secondaryColor = secondaryColor;
    }
    
    if (clubName) {
      updatedData.text = clubName;
    }
    
    // Save initial state to history
    setHistory([updatedData]);
    setHistoryIndex(0);
    updateData(updatedData);
  }, [])

  // Add to history when data changes
  useEffect(() => {
    if (Object.keys(data).length > 0 && (history.length === 0 || JSON.stringify(data) !== JSON.stringify(history[historyIndex]))) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ ...data });
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [data])

  // Draw the logo whenever data changes
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      drawLogo();
    }
  }, [data])

  const templates = [
    { id: "shield", name: "Shield", icon: <Shield className="h-6 w-6" /> },
    { id: "circle", name: "Circle", icon: <Circle className="h-6 w-6" /> },
    { id: "square", name: "Square", icon: <Square className="h-6 w-6" /> },
    { id: "diamond", name: "Diamond", icon: <Square className="h-6 w-6 rotate-45" /> },
    { id: "hexagon", name: "Hexagon", icon: <Hexagon className="h-6 w-6" /> },
    { id: "triangle", name: "Triangle", icon: <Triangle className="h-6 w-6" /> },
    { id: "heart", name: "Heart", icon: <Heart className="h-6 w-6" /> }
  ]

  const emblems = [
    { id: "star", name: "Star", icon: <Star className="h-6 w-6" /> },
    { id: "trophy", name: "Trophy", icon: <Trophy className="h-6 w-6" /> },
    { id: "lightning", name: "Lightning", icon: <Zap className="h-6 w-6" /> },
    { id: "flame", name: "Flame", icon: <Flame className="h-6 w-6" /> },
    { id: "medal", name: "Medal", icon: <Award className="h-6 w-6" /> },
    { id: "circle", name: "Circle", icon: <Circle className="h-6 w-6" /> },
    { id: "square", name: "Square", icon: <Square className="h-6 w-6" /> },
    { id: "triangle", name: "Triangle", icon: <Triangle className="h-6 w-6" /> },
    { id: "heart", name: "Heart", icon: <Heart className="h-6 w-6" /> },
    { id: "none", name: "None", icon: null },
  ]

  const borderStyles = [
    { id: "solid", name: "Solid" },
    { id: "dashed", name: "Dashed" },
    { id: "dotted", name: "Dotted" },
    { id: "double", name: "Double" },
  ]

  const fontFamilies = [
    { id: "Arial", name: "Arial" },
    { id: "Verdana", name: "Verdana" },
    { id: "Times New Roman", name: "Times New Roman" },
    { id: "Georgia", name: "Georgia" },
    { id: "Impact", name: "Impact" },
  ]

  const textPositions = [
    { id: "top", name: "Top" },
    { id: "bottom", name: "Bottom" },
    { id: "center", name: "Center" },
  ]

  const textTransforms = [
    { id: "uppercase", name: "UPPERCASE" },
    { id: "lowercase", name: "lowercase" },
    { id: "capitalize", name: "Capitalize" },
    { id: "none", name: "None" },
  ]
  
  const gradientDirections = [
    { id: "vertical", name: "Vertical" },
    { id: "horizontal", name: "Horizontal" },
    { id: "diagonal", name: "Diagonal" },
    { id: "radial", name: "Radial" },
  ]

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      updateData(history[historyIndex - 1]);
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      updateData(history[historyIndex + 1]);
    }
  }

  const drawLogo = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas size
    const size = Math.min(canvas.width, canvas.height) * 0.8
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Apply rotation
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((data.rotation * Math.PI) / 180)
    ctx.translate(-centerX, -centerY)

    // Apply shadow if enabled
    if (data.shadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      ctx.shadowBlur = 15
      ctx.shadowOffsetX = 5
      ctx.shadowOffsetY = 5
    }

    // Create gradient if enabled
    let fillStyle: string | CanvasGradient = data.primaryColor
    
    if (data.gradient) {
      let gradient: CanvasGradient;
      
      switch (data.gradientDirection) {
        case "horizontal":
          gradient = ctx.createLinearGradient(centerX - size/2, centerY, centerX + size/2, centerY)
          break
        case "diagonal":
          gradient = ctx.createLinearGradient(centerX - size/2, centerY - size/2, centerX + size/2, centerY + size/2)
          break
        case "radial":
          gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size/2)
          break
        default: // vertical
          gradient = ctx.createLinearGradient(centerX, centerY - size/2, centerX, centerY + size/2)
      }
      
      gradient.addColorStop(0, data.primaryColor)
      gradient.addColorStop(1, data.accentColor)
      fillStyle = gradient
    }

    // Set border style
    ctx.fillStyle = fillStyle
    ctx.strokeStyle = data.secondaryColor
    ctx.lineWidth = data.borderWidth
    
    switch (data.borderStyle) {
      case "dashed":
        ctx.setLineDash([15, 5])
        break
      case "dotted":
        ctx.setLineDash([2, 3])
        break
      case "double":
        // Double stroke will be handled separately
        break
      default: // solid
        ctx.setLineDash([])
    }

    // Draw template
    switch (data.template) {
      case "shield":
        drawShield(ctx, centerX, centerY, size)
        break
      case "circle":
        drawCircle(ctx, centerX, centerY, size)
        break
      case "square":
        drawSquare(ctx, centerX, centerY, size)
        break
      case "diamond":
        drawDiamond(ctx, centerX, centerY, size)
        break
      case "hexagon":
        drawHexagon(ctx, centerX, centerY, size)
        break
      case "triangle":
        drawTriangle(ctx, centerX, centerY, size)
        break
      case "heart":
        drawHeart(ctx, centerX, centerY, size)
        break
      default:
        drawShield(ctx, centerX, centerY, size)
    }
    
    // Draw double border if selected
    if (data.borderStyle === "double" && data.borderWidth > 3) {
      ctx.lineWidth = data.borderWidth / 3
      
      // Save the clip area to the shape
      ctx.save()
      
      // Redraw the shape for clipping
      ctx.beginPath()
      switch (data.template) {
        case "shield":
          createShieldPath(ctx, centerX, centerY, size - data.borderWidth / 2)
          break
        case "circle":
          ctx.arc(centerX, centerY, size/2 - data.borderWidth / 2, 0, Math.PI * 2)
          break
        case "square":
          const halfSizeSquare = (size - data.borderWidth) / 2
          ctx.rect(centerX - halfSizeSquare, centerY - halfSizeSquare, size - data.borderWidth, size - data.borderWidth)
          break
        case "diamond":
          createDiamondPath(ctx, centerX, centerY, size - data.borderWidth / 2)
          break
        case "hexagon":
          createHexagonPath(ctx, centerX, centerY, size - data.borderWidth / 2)
          break
        case "triangle":
          createTrianglePath(ctx, centerX, centerY, size - data.borderWidth / 2)
          break
        case "heart":
          createHeartPath(ctx, centerX, centerY, size - data.borderWidth / 2)
          break
      }
      ctx.clip()
      
      // Draw inner stroke
      ctx.strokeStyle = data.secondaryColor
      ctx.lineWidth = data.borderWidth / 2
      ctx.stroke()
      
      ctx.restore()
    }

    // Draw emblem
    if (data.emblem !== "none") {
      let emblemY = centerY
      
      // Adjust emblem position based on text position
      if (data.text && data.textPosition === "center") {
        emblemY = centerY - size * 0.1
      } else if (data.text && data.textPosition === "top") {
        emblemY = centerY + size * 0.1
      } else if (data.text && data.textPosition === "bottom") {
        emblemY = centerY - size * 0.1
      }
      
      drawEmblem(ctx, centerX, emblemY, size * 0.3, data.emblem, data.secondaryColor)
    }

    // Draw text
    if (data.text) {
      ctx.fillStyle = data.secondaryColor
      ctx.font = `bold ${size * (data.fontSize/100)} ${data.fontFamily}`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      
      let transformedText = data.text;
      switch (data.textTransform) {
        case "uppercase":
          transformedText = data.text.toUpperCase();
          break;
        case "lowercase":
          transformedText = data.text.toLowerCase();
          break;
        case "capitalize":
          transformedText = data.text.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          break;
        default:
          transformedText = data.text;
      }
      
      let textY = centerY
      
      // Adjust text position
      if (data.textPosition === "top") {
        textY = centerY - size * 0.3
      } else if (data.textPosition === "bottom") {
        textY = centerY + size * 0.3
      }
      
      ctx.fillText(transformedText, centerX, textY, size * 0.8)
    }

    ctx.restore()
  }

  function createShieldPath(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    const width = size * 0.8
    const height = size

    ctx.moveTo(x - width / 2, y - height / 2)
    ctx.lineTo(x + width / 2, y - height / 2)
    ctx.lineTo(x + width / 2, y + height * 0.2)
    ctx.quadraticCurveTo(x + width / 2, y + height / 2, x, y + height / 2)
    ctx.quadraticCurveTo(x - width / 2, y + height / 2, x - width / 2, y + height * 0.2)
    ctx.closePath()
  }

  const drawShield = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath()
    createShieldPath(ctx, x, y, size)
    ctx.fill()
    ctx.stroke()
  }

  const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const radius = size / 2

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()
  }
  
  const drawSquare = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const halfSize = size / 2

    ctx.beginPath()
    ctx.rect(x - halfSize, y - halfSize, size, size)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()
  }

  function createDiamondPath(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    const halfSize = size / 2

    ctx.moveTo(x, y - halfSize)
    ctx.lineTo(x + halfSize, y)
    ctx.lineTo(x, y + halfSize)
    ctx.lineTo(x - halfSize, y)
    ctx.closePath()
  }

  const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath()
    createDiamondPath(ctx, x, y, size)
    ctx.fill()
    ctx.stroke()
  }

  function createHexagonPath(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    const radius = size / 2

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6
      const px = x + radius * Math.cos(angle)
      const py = y + radius * Math.sin(angle)

      if (i === 0) {
        ctx.moveTo(px, py)
      } else {
        ctx.lineTo(px, py)
      }
    }
    ctx.closePath()
  }

  const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath()
    createHexagonPath(ctx, x, y, size)
    ctx.fill()
    ctx.stroke()
  }
  
  function createTrianglePath(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    const halfSize = size / 2

    ctx.moveTo(x, y - halfSize)
    ctx.lineTo(x + halfSize, y + halfSize)
    ctx.lineTo(x - halfSize, y + halfSize)
    ctx.closePath()
  }
  
  const drawTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath()
    createTrianglePath(ctx, x, y, size)
    ctx.fill()
    ctx.stroke()
  }
  
  function createHeartPath(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    const width = size * 0.8
    const height = size
    
    ctx.moveTo(x, y + height/4)
    
    // Left curve
    ctx.bezierCurveTo(
      x - width/2, y - height/4,
      x - width/2, y - height/2,
      x, y - height/4
    )
    
    // Right curve
    ctx.bezierCurveTo(
      x + width/2, y - height/2,
      x + width/2, y - height/4,
      x, y + height/4
    )
    
    ctx.closePath()
  }
  
  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath()
    createHeartPath(ctx, x, y, size)
    ctx.fill()
    ctx.stroke()
  }

  const drawEmblem = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    emblem: string,
    color: string,
  ) => {
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    switch (emblem) {
      case "star":
        drawStar(ctx, x, y, size)
        break
      case "trophy":
        drawTrophy(ctx, x, y, size)
        break
      case "lightning":
        drawLightning(ctx, x, y, size)
        break
      case "flame":
        drawFlame(ctx, x, y, size)
        break
      case "medal":
        drawMedal(ctx, x, y, size)
        break
      case "circle":
        drawSimpleCircle(ctx, x, y, size)
        break
      case "square":
        drawSimpleSquare(ctx, x, y, size)
        break
      case "triangle":
        drawSimpleTriangle(ctx, x, y, size)
        break
      case "heart":
        drawSimpleHeart(ctx, x, y, size)
        break
    }
  }

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const spikes = 5
    const outerRadius = size / 2
    const innerRadius = outerRadius / 2

    ctx.beginPath()
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (Math.PI * i) / spikes - Math.PI / 2
      const px = x + radius * Math.cos(angle)
      const py = y + radius * Math.sin(angle)

      if (i === 0) {
        ctx.moveTo(px, py)
      } else {
        ctx.lineTo(px, py)
      }
    }
    ctx.closePath()
    ctx.fill()
  }

  const drawTrophy = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const width = size * 0.6
    const height = size

    // Cup
    ctx.beginPath()
    ctx.moveTo(x - width / 2, y - height / 2)
    ctx.lineTo(x + width / 2, y - height / 2)
    ctx.lineTo(x + width / 2, y - height / 4)
    ctx.quadraticCurveTo(x + width, y, x + width / 3, y)
    ctx.lineTo(x - width / 3, y)
    ctx.quadraticCurveTo(x - width, y, x - width / 2, y - height / 4)
    ctx.closePath()
    ctx.fill()

    // Base
    ctx.beginPath()
    ctx.moveTo(x - width / 3, y)
    ctx.lineTo(x + width / 3, y)
    ctx.lineTo(x + width / 4, y + height / 4)
    ctx.lineTo(x - width / 4, y + height / 4)
    ctx.closePath()
    ctx.fill()

    // Stand
    ctx.beginPath()
    ctx.moveTo(x - width / 3, y + height / 4)
    ctx.lineTo(x + width / 3, y + height / 4)
    ctx.lineTo(x + width / 2, y + height / 2)
    ctx.lineTo(x - width / 2, y + height / 2)
    ctx.closePath()
    ctx.fill()
  }

  const drawLightning = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const height = size
    const width = size / 2

    ctx.beginPath()
    ctx.moveTo(x, y - height / 2)
    ctx.lineTo(x + width / 2, y - height / 6)
    ctx.lineTo(x, y + height / 6)
    ctx.lineTo(x, y + height / 2)
    ctx.lineTo(x - width / 2, y)
    ctx.lineTo(x, y - height / 6)
    ctx.closePath()
    ctx.fill()
  }

  const drawFlame = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const height = size
    const width = size / 2

    ctx.beginPath()
    ctx.moveTo(x, y - height / 2)
    ctx.quadraticCurveTo(x + width / 2, y - height / 4, x, y)
    ctx.quadraticCurveTo(x - width / 2, y - height / 4, x, y - height / 2)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.quadraticCurveTo(x + width / 2, y + height / 4, x, y + height / 2)
    ctx.quadraticCurveTo(x - width / 2, y + height / 4, x, y)
    ctx.closePath()
    ctx.fill()
  }

  const drawMedal = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const radius = size / 2

    // Outer circle
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.closePath()
    ctx.stroke()

    // Inner circle
    ctx.beginPath()
    ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }
  
  const drawSimpleCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const radius = size / 2

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }
  
  const drawSimpleSquare = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const halfSize = size / 2

    ctx.beginPath()
    ctx.rect(x - halfSize, y - halfSize, size, size)
    ctx.closePath()
    ctx.fill()
  }
  
  const drawSimpleTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const halfSize = size / 2

    ctx.beginPath()
    ctx.moveTo(x, y - halfSize)
    ctx.lineTo(x + halfSize, y + halfSize)
    ctx.lineTo(x - halfSize, y + halfSize)
    ctx.closePath()
    ctx.fill()
  }
  
  const drawSimpleHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const width = size * 0.8
    const height = size
    
    ctx.beginPath()
    ctx.moveTo(x, y + height/4)
    
    // Left curve
    ctx.bezierCurveTo(
      x - width/2, y - height/4,
      x - width/2, y - height/2,
      x, y - height/4
    )
    
    // Right curve
    ctx.bezierCurveTo(
      x + width/2, y - height/2,
      x + width/2, y - height/4,
      x, y + height/4
    )
    
    ctx.closePath()
    ctx.fill()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  const downloadLogo = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `${data.text || "club"}-logo.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetDesign = () => {
    updateData({ ...initialData });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Logo Customizer</h2>
        <div className="flex items-center space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <canvas 
                ref={canvasRef} 
                width={400} 
                height={400} 
                className="border rounded-lg shadow-md bg-white"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1" 
                onClick={downloadLogo}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Logo
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={resetDesign}
              >
                Reset Design
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="template">Shape</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="emblem">Emblem</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="border">Border</TabsTrigger>
                <TabsTrigger value="effects">Effects</TabsTrigger>
                <TabsTrigger value="font">Font</TabsTrigger>
                <TabsTrigger value="transform">Transform</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="template">
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <Button 
                      key={template.id} 
                      variant={data.template === template.id ? "default" : "outline"} 
                      onClick={() => updateData({ ...data, template: template.id })}
                      className="flex items-center justify-center h-16"
                    >
                      {template.icon}
                      <span className="ml-2">{template.name}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="colors">
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input 
                    type="color" 
                    id="primaryColor" 
                    value={data.primaryColor} 
                    onChange={(e) => updateData({ ...data, primaryColor: e.target.value })} 
                  />
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <Input 
                    type="color" 
                    id="secondaryColor" 
                    value={data.secondaryColor} 
                    onChange={(e) => updateData({ ...data, secondaryColor: e.target.value })} 
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <Input 
                    type="color" 
                    id="accentColor" 
                    value={data.accentColor} 
                    onChange={(e) => updateData({ ...data, accentColor: e.target.value })} 
                  />

                  <Label htmlFor="gradient">Gradient</Label>
                  <Switch 
                    id="gradient" 
                    checked={data.gradient} 
                    onCheckedChange={(checked) => updateData({ ...data, gradient: checked })}
                  />
                  {data.gradient && (
                    <Select 
                      value={data.gradientDirection} 
                      onValueChange={(value) => updateData({ ...data, gradientDirection: value })} 
                      defaultValue="vertical"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Gradient Direction" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradientDirections.map((direction) => (
                          <SelectItem key={direction.id} value={direction.id}>
                            {direction.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="emblem">
                <div className="grid grid-cols-2 gap-4">
                  {emblems.map((emblem) => (
                    <Button 
                      key={emblem.id} 
                      variant={data.emblem === emblem.id ? "default" : "outline"} 
                      onClick={() => updateData({ ...data, emblem: emblem.id })}
                      className="flex items-center justify-center h-16"
                    >
                      {emblem.icon}
                      <span className="ml-2">{emblem.name}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="text">
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="text">Text</Label>
                  <Input 
                    type="text" 
                    id="text" 
                    value={data.text} 
                    onChange={(e) => updateData({ ...data, text: e.target.value })} 
                  />
                  <Label htmlFor="textPosition">Text Position</Label>
                  <Select 
                    value={data.textPosition} 
                    onValueChange={(value) => updateData({ ...data, textPosition: value })} 
                    defaultValue="bottom"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Text Position" />
                    </SelectTrigger>
                    <SelectContent>
                      {textPositions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          {position.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Slider 
                    id="fontSize" 
                    value={[data.fontSize]} 
                    onValueChange={(value) => updateData({ ...data, fontSize: value[0] })} 
                    min={5} 
                    max={100} 
                    step={1} 
                  />
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select 
                    value={data.fontFamily} 
                    onValueChange={(value) => updateData({ ...data, fontFamily: value })} 
                    defaultValue="Arial"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Font Family" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font.id} value={font.id}>
                          {font.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Label htmlFor="textTransform">Text Transform</Label>
                  <Select 
                    value={data.textTransform} 
                    onValueChange={(value) => updateData({ ...data, textTransform: value })} 
                    defaultValue="uppercase"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Text Transform" />
                    </SelectTrigger>
                    <SelectContent>
                      {textTransforms.map((transform) => (
                        <SelectItem key={transform.id} value={transform.id}>
                          {transform.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="border">
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="borderWidth">Border Width</Label>
                  <Slider 
                    id="borderWidth" 
                    value={[data.borderWidth]} 
                    onValueChange={(value) => updateData({ ...data, borderWidth: value[0] })} 
                    min={0} 
                    max={20} 
                    step={1} 
                  />
                  <Label htmlFor="borderStyle">Border Style</Label>
                  <Select 
                    value={data.borderStyle} 
                    onValueChange={(value) => updateData({ ...data, borderStyle: value })} 
                    defaultValue="solid"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Border Style" />
                    </SelectTrigger>
                    <SelectContent>
                      {borderStyles.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Label htmlFor="shadow">Shadow</Label>
                  <Switch 
                    id="shadow" 
                    checked={data.shadow} 
                    onCheckedChange={(checked) => updateData({ ...data, shadow: checked })} 
                  />
                  <Label htmlFor="rotation">Rotation</Label>
                  <Slider 
                    id="rotation" 
                    value={[data.rotation]} 
                    onValueChange={(value) => updateData({ ...data, rotation: value[0] })} 
                    min={0} 
                    max={360} 
                    step={1}
                  />
                </div>
              </TabsContent>

              <TabsContent value="effects">
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="shadow">Shadow</Label>
                  <Switch 
                    id="shadow" 
                    checked={data.shadow} 
                    onCheckedChange={(checked) => updateData({ ...data, shadow: checked })} 
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Label htmlFor="gradient">Gradient</Label>
                  <Switch 
                    id="gradient" 
                    checked={data.gradient} 
                    onCheckedChange={(checked) => updateData({ ...data, gradient: checked })} 
                  />
                  {data.gradient && (
                    <Select 
                      value={data.gradientDirection} 
                      onValueChange={(value) => updateData({ ...data, gradientDirection: value })} 
                      defaultValue="vertical"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Gradient Direction" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradientDirections.map((direction) => (
                          <SelectItem key={direction.id} value={direction.id}>
                            {direction.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="font">
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select 
                    value={data.fontFamily} 
                    onValueChange={(value) => updateData({ ...data, fontFamily: value })} 
                    defaultValue="Arial"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Font Family" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font.id} value={font.id}>
                          {font.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Slider 
                    id="fontSize" 
                    value={[data.fontSize]} 
                    onValueChange={(value) => updateData({ ...data, fontSize: value[0] })} 
                    min={5} 
                    max={100} 
                    step={1} 
                  />
                  <Label htmlFor="textTransform">Text Transform</Label>
                  <Select 
                    value={data.textTransform} 
                    onValueChange={(value) => updateData({ ...data, textTransform: value })} 
                    defaultValue="uppercase"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Text Transform" />
                    </SelectTrigger>
                    <SelectContent>
                      {textTransforms.map((transform) => (
                        <SelectItem key={transform.id} value={transform.id}>
                          {transform.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="transform">
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="rotation">Rotation</Label>
                  <Slider 
                    id="rotation" 
                    value={[data.rotation]} 
                    onValueChange={(value) => updateData({ ...data, rotation: value[0] })} 
                    min={0} 
                    max={360} 
                    step={1}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Label htmlFor="textPosition">Text Position</Label>
                  <Select 
                    value={data.textPosition} 
                    onValueChange={(value) => updateData({ ...data, textPosition: value })} 
                    defaultValue="bottom"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Text Position" />
                    </SelectTrigger>
                    <SelectContent>
                      {textPositions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          {position.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Label htmlFor="textTransform">Text Transform</Label>
                  <Select 
                    value={data.textTransform} 
                    onValueChange={(value) => updateData({ ...data, textTransform: value })} 
                    defaultValue="uppercase"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Text Transform" />
                    </SelectTrigger>
                    <SelectContent>
                      {textTransforms.map((transform) => (
                        <SelectItem key={transform.id} value={transform.id}>
                          {transform.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Label htmlFor="shadow">Shadow</Label>
                  <Switch 
                    id="shadow" 
                    checked={data.shadow} 
                    onCheckedChange={(checked) => updateData({ ...data, shadow: checked })}
                  />
                </div>
              </TabsContent>
              <TabsContent value="history">
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="history">History</Label>
                  <div className="space-y-2">
                    {history.map((item, index) => (
                      <Button 
                        key={index} 
                        variant={index === historyIndex ? "default" : "outline"} 
                        onClick={() => setHistoryIndex(index)}
                      >
                        {item.action}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setHistoryIndex(historyIndex - 1)} 
                    disabled={historyIndex <= 0}
                  >
                    Undo
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setHistoryIndex(historyIndex + 1)} 
                    disabled={historyIndex >= history.length - 1}
                  >
                    Redo
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Next
        </Button>
      </div>
    </form>
  )
}
export default LogoCustomizerStep


Shader.js
=========

A small and compact closure-compiler compatible javascript library for managing shaders.

Features:
---------

 - shader source caching (speeds up compilation of multiple identical shaders)
 - uniform management (simplifies uniforms to make them easyer to use, reducing the amount of typing required, 1 method will update all types of uniforms.)
 - simplifys rendering code by compacting code that is always required to use a shader into one method

Usage:
------

To create a shader:

    var shader = Object.create(window.ShaderPrototype);

Loading a shader:

    var vertexShaderUrl = "http://www.example.com/shaders/vertex_shader.glsl";
    var fragmentShaderUrl = "http://www.example.com/shaders/fragment_shader.glsl";
    shader.load(vertexShaderUrl,fragmentShaderUrl);

Compiling a loaded shader:

    var ctx = document.getElementById("canvas").getContext("webgl");	
    shader.compile(ctx);

Setting up uniforms:

    shader.addOption(uniformVariableName,defaultValue,type*);

  *see the uniform type mapping below

Updating uniforms:

    shader.updateOption(uniformVariableName,newValue);

Updating other variable types:

  To update variables that are not uniforms you need to use the actual shader program object, this is available by calling:
    shader.getShader();

Using the shader:

    shader.bindShader(ctx);
    //your rendering code goes here

Uniform Type Mapping:

  The mappings follow a simple rule, take the method that you would normally use to change it and strip off the begining "uniform" in it's name

  Example:
    ctx.uniformMatrix2fv() -> "Matrix2fv"
    ctx.uniform4f() -> "4f"
